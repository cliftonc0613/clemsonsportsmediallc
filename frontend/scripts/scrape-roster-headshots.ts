/**
 * Clemson Roster Headshot Scraper
 *
 * Scrapes clemsontigers.com roster pages, downloads player headshot images,
 * and updates local JSON roster files with local image paths.
 *
 * Usage:
 *   npx tsx scripts/scrape-roster-headshots.ts --sport football --year 2025
 *   npx tsx scripts/scrape-roster-headshots.ts --all --year 2025
 */

import { mkdir, writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Sport configuration with URL slugs
const SPORTS_CONFIG: Record<
  string,
  { urlSlug: string; displayName: string }
> = {
  football: { urlSlug: "football", displayName: "Football" },
  "mens-basketball": {
    urlSlug: "mens-basketball",
    displayName: "Men's Basketball",
  },
  "womens-soccer": { urlSlug: "womens-soccer", displayName: "Women's Soccer" },
  baseball: { urlSlug: "baseball", displayName: "Baseball" },
  softball: { urlSlug: "softball", displayName: "Softball" },
};

interface Player {
  id: string;
  number: string;
  firstName: string;
  lastName: string;
  position: string;
  positionFull: string;
  height: string;
  weight: string;
  year: string;
  isRedshirt: boolean;
  hometown: string;
  highSchool: string;
  headshot?: string;
}

interface RosterGroup {
  name: string;
  players: Player[];
}

interface RosterData {
  sport: string;
  season: string;
  lastUpdated: string;
  groups: RosterGroup[];
}

/**
 * Download an image and save it to disk
 */
async function downloadImage(
  url: string,
  outputPath: string
): Promise<boolean> {
  try {
    // Handle relative URLs
    const fullUrl = url.startsWith("http")
      ? url
      : `https://clemsontigers.com${url}`;

    console.log(`  Downloading: ${fullUrl}`);
    const response = await fetch(fullUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      console.error(`  Failed to download: ${response.status}`);
      return false;
    }

    const buffer = await response.arrayBuffer();
    await writeFile(outputPath, Buffer.from(buffer));
    console.log(`  Saved: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`  Error downloading ${url}:`, error);
    return false;
  }
}

/**
 * Generate possible headshot URLs for a player
 * Clemson uses the pattern: /wp-content/uploads/YYYY/MM/LastnameFirstname.jpg
 */
function generatePossibleHeadshotUrls(
  firstName: string,
  lastName: string,
  year: string
): string[] {
  // Clean names - remove periods, hyphens for URL construction
  const cleanFirst = firstName.replace(/\./g, "").replace(/-/g, "");
  const cleanLast = lastName.replace(/\./g, "").replace(/-/g, "").replace(/'/g, "");

  // Capitalize first letter of each name part
  const formatName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  const formattedLast = formatName(cleanLast);
  const formattedFirst = formatName(cleanFirst);

  // Generate URLs for different possible months/years
  const urls: string[] = [];
  const baseUrl = "https://clemsontigers.com/wp-content/uploads";

  // Try current year and previous year with various months
  const years = [year, String(Number(year) - 1)];
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  for (const y of years) {
    for (const month of months) {
      // Standard format: LastnameFirstname.jpg
      urls.push(`${baseUrl}/${y}/${month}/${formattedLast}${formattedFirst}.jpg`);
      // Alternative: FirstnameLastname.jpg
      urls.push(`${baseUrl}/${y}/${month}/${formattedFirst}${formattedLast}.jpg`);
    }
  }

  return urls;
}

/**
 * Check if a URL exists by making a HEAD request
 */
async function checkUrlExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Find the working headshot URL for a player by trying multiple patterns
 */
async function findHeadshotUrl(
  firstName: string,
  lastName: string,
  year: string
): Promise<string | null> {
  const possibleUrls = generatePossibleHeadshotUrls(firstName, lastName, year);

  // Try URLs in batches to avoid too many concurrent requests
  const batchSize = 6;
  for (let i = 0; i < possibleUrls.length; i += batchSize) {
    const batch = possibleUrls.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (url) => {
        const exists = await checkUrlExists(url);
        return exists ? url : null;
      })
    );

    const found = results.find((r) => r !== null);
    if (found) return found;
  }

  return null;
}

/**
 * Process a single sport: find headshots and update JSON
 * Uses URL pattern matching to discover headshot URLs directly
 */
async function processSport(sport: string, year: string): Promise<void> {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Processing ${SPORTS_CONFIG[sport]?.displayName || sport} (${year})`);
  console.log("=".repeat(60));

  const baseDir = path.resolve(__dirname, "..");
  const imageDir = path.join(baseDir, "public", "images", "roster", sport, year);
  const jsonPath = path.join(baseDir, "data", "rosters", year, `${sport}.json`);

  // Create image directory
  await mkdir(imageDir, { recursive: true });
  console.log(`Image directory: ${imageDir}`);

  // Check if JSON file exists
  if (!existsSync(jsonPath)) {
    console.error(`JSON file not found: ${jsonPath}`);
    return;
  }

  // Read existing roster JSON
  const jsonContent = await readFile(jsonPath, "utf-8");
  const rosterData: RosterData = JSON.parse(jsonContent);

  let downloadCount = 0;
  let updateCount = 0;
  let notFoundCount = 0;

  // Count total players
  let totalPlayers = 0;
  for (const group of rosterData.groups) {
    totalPlayers += group.players.length;
  }
  console.log(`Found ${totalPlayers} players in roster JSON\n`);

  // Process each player in roster JSON
  for (const group of rosterData.groups) {
    console.log(`\nProcessing ${group.name}...`);

    for (const player of group.players) {
      const fullName = `${player.firstName} ${player.lastName}`;
      const imageFileName = `${player.id}.jpg`;
      const imagePath = path.join(imageDir, imageFileName);
      const publicPath = `/images/roster/${sport}/${year}/${imageFileName}`;

      // Skip if already downloaded
      if (existsSync(imagePath)) {
        console.log(`  ✓ ${fullName} (already exists)`);
        player.headshot = publicPath;
        updateCount++;
        continue;
      }

      // Try to find headshot URL
      console.log(`  Searching for ${fullName}...`);
      const headshotUrl = await findHeadshotUrl(player.firstName, player.lastName, year);

      if (headshotUrl) {
        console.log(`    Found: ${headshotUrl}`);
        const success = await downloadImage(headshotUrl, imagePath);
        if (success) {
          player.headshot = publicPath;
          downloadCount++;
          updateCount++;
        } else {
          notFoundCount++;
        }
      } else {
        console.log(`    ✗ No headshot found`);
        notFoundCount++;
      }

      // Small delay to be respectful to the server
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  // Update lastUpdated timestamp
  rosterData.lastUpdated = new Date().toISOString();

  // Write updated JSON
  await writeFile(jsonPath, JSON.stringify(rosterData, null, 2));
  console.log(`\n${"=".repeat(40)}`);
  console.log(`Results for ${sport}:`);
  console.log(`  Downloaded: ${downloadCount} images`);
  console.log(`  Updated: ${updateCount} player records`);
  console.log(`  Not found: ${notFoundCount} players`);
  console.log(`Updated: ${jsonPath}`);
}

/**
 * Parse command line arguments
 */
function parseArgs(): { sport?: string; year: string; all: boolean } {
  const args = process.argv.slice(2);
  let sport: string | undefined;
  let year = "2025";
  let all = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--sport" && args[i + 1]) {
      sport = args[i + 1];
      i++;
    } else if (args[i] === "--year" && args[i + 1]) {
      year = args[i + 1];
      i++;
    } else if (args[i] === "--all") {
      all = true;
    }
  }

  return { sport, year, all };
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log("Clemson Roster Headshot Scraper");
  console.log("================================\n");

  const { sport, year, all } = parseArgs();

  if (!sport && !all) {
    console.log("Usage:");
    console.log(
      "  npx tsx scripts/scrape-roster-headshots.ts --sport <sport> --year <year>"
    );
    console.log("  npx tsx scripts/scrape-roster-headshots.ts --all --year <year>");
    console.log("\nAvailable sports:");
    Object.entries(SPORTS_CONFIG).forEach(([key, config]) => {
      console.log(`  - ${key} (${config.displayName})`);
    });
    process.exit(1);
  }

  if (all) {
    // Process all sports
    for (const sportKey of Object.keys(SPORTS_CONFIG)) {
      try {
        await processSport(sportKey, year);
      } catch (error) {
        console.error(`Error processing ${sportKey}:`, error);
      }
    }
  } else if (sport) {
    if (!SPORTS_CONFIG[sport]) {
      console.error(`Unknown sport: ${sport}`);
      console.log("Available sports:", Object.keys(SPORTS_CONFIG).join(", "));
      process.exit(1);
    }
    await processSport(sport, year);
  }

  console.log("\n================================");
  console.log("Done!");
}

main().catch(console.error);
