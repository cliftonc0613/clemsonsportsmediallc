/**
 * Clemson Full Roster Scraper
 *
 * Uses Playwright to scrape the full roster from clemsontigers.com.
 * This handles JavaScript-rendered DataTables that can't be scraped with simple fetch + cheerio.
 *
 * Usage:
 *   npx tsx scripts/scrape-full-roster.ts --sport football --year 2025
 *   npx tsx scripts/scrape-full-roster.ts --all --year 2025
 */

import { chromium, Browser, Page } from "playwright";
import { mkdir, writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Sport configuration with URL slugs
const SPORTS_CONFIG: Record<
  string,
  { urlSlug: string; displayName: string; rosterUrl: string }
> = {
  football: {
    urlSlug: "football",
    displayName: "Football",
    rosterUrl: "https://clemsontigers.com/sports/football/roster/",
  },
  "mens-basketball": {
    urlSlug: "mens-basketball",
    displayName: "Men's Basketball",
    rosterUrl: "https://clemsontigers.com/sports/mens-basketball/roster/",
  },
  "mens-soccer": {
    urlSlug: "mens-soccer",
    displayName: "Men's Soccer",
    rosterUrl: "https://clemsontigers.com/sports/mens-soccer/roster/",
  },
  "womens-soccer": {
    urlSlug: "womens-soccer",
    displayName: "Women's Soccer",
    rosterUrl: "https://clemsontigers.com/sports/womens-soccer/roster/",
  },
  baseball: {
    urlSlug: "baseball",
    displayName: "Baseball",
    rosterUrl: "https://clemsontigers.com/sports/baseball/roster/",
  },
  softball: {
    urlSlug: "softball",
    displayName: "Softball",
    rosterUrl: "https://clemsontigers.com/sports/softball/roster/",
  },
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
  profileUrl?: string;
  headshotUrl?: string;
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
 * Convert player name to URL-friendly ID
 */
function createPlayerId(firstName: string, lastName: string): string {
  const cleanName = `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/'/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
  return cleanName;
}

/**
 * Parse year/class string to extract redshirt status
 * Clemson uses asterisks (*Jr., *So.) and plus (+Sr.) for special status
 */
function parseYear(yearStr: string): { year: string; isRedshirt: boolean } {
  const normalizedYear = yearStr.trim();

  // Check for asterisk (redshirt indicator)
  const isRedshirt =
    normalizedYear.startsWith("*") ||
    normalizedYear.toLowerCase().includes("r-") ||
    normalizedYear.toLowerCase().includes("rs");

  // Check for plus sign (super senior indicator)
  const isSuperSenior = normalizedYear.startsWith("+");

  // Clean the year string
  let year = normalizedYear
    .replace(/^\*+/, "")
    .replace(/^\++/, "")
    .replace(/^r-/i, "")
    .replace(/^rs /i, "")
    .trim();

  // Add super senior indicator if applicable
  if (isSuperSenior) {
    year = `${year} (Super)`;
  }

  return { year, isRedshirt };
}

/**
 * Map position abbreviation to full name
 */
function getPositionFull(pos: string): string {
  const positionMap: Record<string, string> = {
    // Football Offense
    QB: "Quarterback",
    RB: "Running Back",
    FB: "Fullback",
    WR: "Wide Receiver",
    TE: "Tight End",
    OL: "Offensive Line",
    OT: "Offensive Tackle",
    OG: "Offensive Guard",
    C: "Center",
    // Football Defense
    DL: "Defensive Line",
    DE: "Defensive End",
    DT: "Defensive Tackle",
    NT: "Nose Tackle",
    LB: "Linebacker",
    ILB: "Inside Linebacker",
    OLB: "Outside Linebacker",
    CB: "Cornerback",
    S: "Safety",
    DB: "Defensive Back",
    FS: "Free Safety",
    NB: "Nickelback",
    // Special Teams
    K: "Place Kicker",
    P: "Punter",
    LS: "Long Snapper",
    PK: "Place Kicker",
    // Basketball
    G: "Guard",
    PG: "Point Guard",
    SG: "Shooting Guard",
    F: "Forward",
    SF: "Small Forward",
    PF: "Power Forward",
    // Soccer
    GK: "Goalkeeper",
    D: "Defender",
    M: "Midfielder",
    MF: "Midfielder",
    // Baseball/Softball (SS = Shortstop in this context)
    "1B": "First Base",
    "2B": "Second Base",
    "3B": "Third Base",
    SS: "Shortstop",
    LF: "Left Field",
    CF: "Center Field",
    RF: "Right Field",
    OF: "Outfield",
    IF: "Infield",
    "C/UT": "Catcher/Utility",
    UT: "Utility",
    DH: "Designated Hitter",
    RHP: "Right-Handed Pitcher",
    LHP: "Left-Handed Pitcher",
  };

  return positionMap[pos] || pos;
}

/**
 * Determine position group (for football)
 */
function getPositionGroup(position: string, sport: string): string {
  if (sport !== "football") return "Roster";

  const offensePositions = ["QB", "RB", "FB", "WR", "TE", "OL", "OT", "OG", "C"];
  const defensePositions = [
    "DL",
    "DE",
    "DT",
    "NT",
    "LB",
    "ILB",
    "OLB",
    "CB",
    "S",
    "DB",
    "FS",
    "SS",
    "NB",
  ];
  const specialTeamsPositions = ["K", "P", "LS", "PK"];

  if (offensePositions.includes(position)) return "Offense";
  if (defensePositions.includes(position)) return "Defense";
  if (specialTeamsPositions.includes(position)) return "Special Teams";
  return "Offense"; // Default for unknown positions
}

/**
 * Scrape a single sport roster using Playwright
 */
async function scrapeRoster(
  browser: Browser,
  sport: string,
  year: string
): Promise<RosterData> {
  const config = SPORTS_CONFIG[sport];
  if (!config) {
    throw new Error(`Unknown sport: ${sport}`);
  }

  console.log(`\nScraping ${config.displayName} roster...`);
  console.log(`URL: ${config.rosterUrl}`);

  const page = await browser.newPage();

  try {
    // Navigate to roster page
    await page.goto(config.rosterUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait for DataTable to load and render
    console.log("Waiting for DataTable to render...");
    await page.waitForSelector("table.person__list", {
      timeout: 30000,
      state: "attached",
    });

    // Give extra time for DataTable to populate all rows
    await page.waitForTimeout(8000);

    // Extract player data from the DataTable
    const players = await page.evaluate(() => {
      const rows = document.querySelectorAll("table.person__list tbody tr");
      const extractedPlayers: {
        number: string;
        name: string;
        position: string;
        height: string;
        weight: string;
        year: string;
        hometown: string;
        profileUrl: string;
      }[] = [];

      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 7) return;

        // Extract from table cells
        // Column order: Number, Name, Position, Ht., Wt., Year, Hometown, [Twitter], [Instagram]
        const number = cells[0]?.textContent?.trim() || "";
        const nameLink = cells[1]?.querySelector("a");
        const name = cells[1]?.textContent?.trim() || "";
        const position = cells[2]?.textContent?.trim() || "";
        const height = cells[3]?.textContent?.trim() || "";
        const weight = cells[4]?.textContent?.trim() || "";
        const year = cells[5]?.textContent?.trim() || "";
        const hometown = cells[6]?.textContent?.trim() || "";
        const profileUrl = nameLink?.getAttribute("href") || "";

        if (name) {
          extractedPlayers.push({
            number,
            name,
            position,
            height,
            weight,
            year,
            hometown,
            profileUrl,
          });
        }
      });

      return extractedPlayers;
    });

    console.log(`Found ${players.length} players in table`);

    // Process and group players
    const groupedPlayers: Record<string, Player[]> = {};

    for (const rawPlayer of players) {
      // Parse name - handle various formats
      const nameParts = rawPlayer.name.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Parse year
      const { year, isRedshirt } = parseYear(rawPlayer.year);

      // Create player object
      const player: Player = {
        id: createPlayerId(firstName, lastName),
        number: rawPlayer.number,
        firstName,
        lastName,
        position: rawPlayer.position,
        positionFull: getPositionFull(rawPlayer.position),
        height: rawPlayer.height,
        weight: rawPlayer.weight,
        year,
        isRedshirt,
        hometown: rawPlayer.hometown,
        highSchool: "", // Not available in table view
        profileUrl: rawPlayer.profileUrl,
      };

      // Group by position
      const group = getPositionGroup(player.position, sport);
      if (!groupedPlayers[group]) {
        groupedPlayers[group] = [];
      }
      groupedPlayers[group].push(player);
    }

    // Convert to roster data format
    const groups: RosterGroup[] = [];
    const groupOrder =
      sport === "football"
        ? ["Offense", "Defense", "Special Teams"]
        : ["Roster"];

    for (const groupName of groupOrder) {
      if (groupedPlayers[groupName] && groupedPlayers[groupName].length > 0) {
        // Sort players by number
        groupedPlayers[groupName].sort((a, b) => {
          const numA = parseInt(a.number) || 999;
          const numB = parseInt(b.number) || 999;
          return numA - numB;
        });

        groups.push({
          name: groupName,
          players: groupedPlayers[groupName],
        });
      }
    }

    return {
      sport: config.displayName,
      season: year,
      lastUpdated: new Date().toISOString(),
      groups,
    };
  } finally {
    await page.close();
  }
}

/**
 * Get headshot URL from player detail page
 */
async function getHeadshotUrl(
  page: Page,
  profileUrl: string
): Promise<string | null> {
  try {
    const fullUrl = profileUrl.startsWith("http")
      ? profileUrl
      : `https://clemsontigers.com${profileUrl}`;

    await page.goto(fullUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await page.waitForTimeout(2000);

    const headshotUrl = await page.evaluate(() => {
      // Look for player headshot image in Clemson's profile-bio structure
      const img =
        document.querySelector(".profile-bio__meta-photo img") ||
        document.querySelector(".profile-bio__hero img") ||
        document.querySelector(".person__headshot img, .headshot img, .person__image img, img[class*='headshot']") ||
        document.querySelector(".person__header img, .bio-photo img") ||
        document.querySelector("figure img, .person img");

      // Get the src, preferring data-src if available (lazy loading)
      const src = img?.getAttribute("data-src") || img?.getAttribute("src");

      // Filter out non-player images
      if (src && (src.includes("uploads") || src.includes("headshot"))) {
        // Skip team logos/icons
        if (src.includes("logo") || src.includes("icon") || src.includes("sponsor")) {
          return null;
        }
        return src;
      }
      return null;
    });

    return headshotUrl;
  } catch (error) {
    console.error(`  Error fetching headshot from ${profileUrl}:`, error);
    return null;
  }
}

/**
 * Download an image and save it to disk
 */
async function downloadImage(
  url: string,
  outputPath: string
): Promise<boolean> {
  try {
    if (!url || url.includes("placeholder") || url.includes("default")) {
      return false;
    }

    const fullUrl = url.startsWith("http")
      ? url
      : `https://clemsontigers.com${url}`;

    console.log(`  Downloading: ${fullUrl.substring(0, 80)}...`);
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
    console.log(`  Saved: ${path.basename(outputPath)}`);
    return true;
  } catch (error) {
    console.error(`  Error downloading ${url}:`, error);
    return false;
  }
}

/**
 * Process a single sport: scrape roster and optionally download headshots
 */
async function processSport(
  browser: Browser,
  sport: string,
  year: string,
  downloadHeadshots: boolean
): Promise<void> {
  console.log(`\n${"=".repeat(60)}`);
  console.log(
    `Processing ${SPORTS_CONFIG[sport]?.displayName || sport} (${year})`
  );
  console.log("=".repeat(60));

  const baseDir = path.resolve(__dirname, "..");
  const imageDir = path.join(
    baseDir,
    "public",
    "images",
    "roster",
    sport,
    year
  );
  const dataDir = path.join(baseDir, "data", "rosters", year);
  const jsonPath = path.join(dataDir, `${sport}.json`);

  // Ensure directories exist
  await mkdir(imageDir, { recursive: true });
  await mkdir(dataDir, { recursive: true });

  // Scrape the roster
  const rosterData = await scrapeRoster(browser, sport, year);

  let downloadCount = 0;
  let skippedCount = 0;
  let totalPlayers = 0;

  // Count and optionally download headshots
  for (const group of rosterData.groups) {
    totalPlayers += group.players.length;

    if (downloadHeadshots) {
      console.log(`\nDownloading headshots for ${group.name}...`);

      // Create a new page for fetching player detail pages
      const detailPage = await browser.newPage();

      for (const player of group.players) {
        const imageFileName = `${player.id}.jpg`;
        const imagePath = path.join(imageDir, imageFileName);
        const publicPath = `/images/roster/${sport}/${year}/${imageFileName}`;

        // Skip if already downloaded
        if (existsSync(imagePath)) {
          console.log(
            `  ✓ ${player.firstName} ${player.lastName} (already exists)`
          );
          player.headshot = publicPath;
          skippedCount++;
          continue;
        }

        // Get headshot URL from player detail page
        if (player.profileUrl) {
          console.log(`  Fetching ${player.firstName} ${player.lastName}...`);
          const headshotUrl = await getHeadshotUrl(detailPage, player.profileUrl);

          if (headshotUrl) {
            const success = await downloadImage(headshotUrl, imagePath);
            if (success) {
              player.headshot = publicPath;
              downloadCount++;
            }
          } else {
            console.log(`    No headshot found`);
          }

          // Small delay to be respectful
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        // Remove profileUrl from final output
        delete player.profileUrl;
      }

      await detailPage.close();
    } else {
      // Just remove profileUrl without downloading
      for (const player of group.players) {
        delete player.profileUrl;
      }
    }
  }

  // Write JSON file
  await writeFile(jsonPath, JSON.stringify(rosterData, null, 2));

  console.log(`\n${"=".repeat(40)}`);
  console.log(`Results for ${sport}:`);
  console.log(`  Total players: ${totalPlayers}`);
  if (downloadHeadshots) {
    console.log(`  Downloaded: ${downloadCount} new headshots`);
    console.log(`  Skipped (already exists): ${skippedCount}`);
  }
  console.log(`  Saved: ${jsonPath}`);
}

/**
 * Parse command line arguments
 */
function parseArgs(): {
  sport?: string;
  year: string;
  all: boolean;
  downloadHeadshots: boolean;
} {
  const args = process.argv.slice(2);
  let sport: string | undefined;
  let year = "2025";
  let all = false;
  let downloadHeadshots = true;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--sport" && args[i + 1]) {
      sport = args[i + 1];
      i++;
    } else if (args[i] === "--year" && args[i + 1]) {
      year = args[i + 1];
      i++;
    } else if (args[i] === "--all") {
      all = true;
    } else if (args[i] === "--no-headshots") {
      downloadHeadshots = false;
    }
  }

  return { sport, year, all, downloadHeadshots };
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log("Clemson Full Roster Scraper (Playwright)");
  console.log("========================================\n");

  const { sport, year, all, downloadHeadshots } = parseArgs();

  if (!sport && !all) {
    console.log("Usage:");
    console.log(
      "  npx tsx scripts/scrape-full-roster.ts --sport <sport> --year <year>"
    );
    console.log("  npx tsx scripts/scrape-full-roster.ts --all --year <year>");
    console.log("\nOptions:");
    console.log("  --no-headshots  Skip downloading headshot images");
    console.log("\nAvailable sports:");
    Object.entries(SPORTS_CONFIG).forEach(([key, config]) => {
      console.log(`  - ${key} (${config.displayName})`);
    });
    process.exit(1);
  }

  // Launch browser
  console.log("Launching browser...");
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    if (all) {
      // Process all sports
      for (const sportKey of Object.keys(SPORTS_CONFIG)) {
        try {
          await processSport(browser, sportKey, year, downloadHeadshots);
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
      await processSport(browser, sport, year, downloadHeadshots);
    }
  } finally {
    await browser.close();
  }

  console.log("\n========================================");
  console.log("Done!");
}

main().catch(console.error);
