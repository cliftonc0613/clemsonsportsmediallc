/**
 * ESPN Game Score Block - Edit Component
 *
 * Displays a full ScoreCard preview in the WordPress editor matching
 * the Next.js frontend design. Fetches game data from ESPN API.
 */

import { useEffect, useState } from '@wordpress/element';
import {
  InspectorControls,
  useBlockProps,
} from '@wordpress/block-editor';
import {
  PanelBody,
  SelectControl,
  TextControl,
  Spinner,
  Placeholder,
} from '@wordpress/components';

// Sport options
const SPORTS = [
  { label: 'Football', value: 'football' },
  { label: "Men's Basketball", value: 'mensBasketball' },
  { label: "Women's Basketball", value: 'womensBasketball' },
];

// Generate season options (current year back to 2015)
const generateSeasonOptions = () => {
  const currentYear = new Date().getFullYear();
  const options = [{ label: 'Current Season', value: '' }];
  for (let year = currentYear; year >= 2015; year--) {
    options.push({ label: `${year}-${year + 1}`, value: String(year) });
  }
  return options;
};

const SEASONS = generateSeasonOptions();

// Clemson brand colors
const CLEMSON_ORANGE = '#F56600';
const CLEMSON_PURPLE = '#522D80';
const CLEMSON_TEAM_ID = '228';

/**
 * Safely extract a display value from ESPN API data
 * ESPN API can return objects like {value, displayValue} or primitive values
 */
const getDisplayValue = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') {
    return val.displayValue || val.value || fallback;
  }
  return String(val);
};

/**
 * Get ESPN team logo URL
 * Constructs logo URL from team ID if not directly provided
 */
const getTeamLogo = (team) => {
  // Check if logo is directly provided
  if (team?.logo) return team.logo;

  // Check logos array
  if (team?.logos?.length > 0) {
    const defaultLogo = team.logos.find(l => l.rel?.includes('default'));
    if (defaultLogo?.href) return defaultLogo.href;
    return team.logos[0]?.href;
  }

  // Construct logo URL from team ID
  if (team?.id) {
    return `https://a.espncdn.com/i/teamlogos/ncaa/500/${team.id}.png`;
  }

  return null;
};

/**
 * Get ESPN API schedule URL for a sport
 */
const getScheduleUrl = (sport, season) => {
  const sportPaths = {
    football: 'football/college-football',
    mensBasketball: 'basketball/mens-college-basketball',
    womensBasketball: 'basketball/womens-college-basketball',
  };
  let url = `https://site.api.espn.com/apis/site/v2/sports/${sportPaths[sport]}/teams/${CLEMSON_TEAM_ID}/schedule`;
  if (season) {
    url += `?season=${season}`;
  }
  return url;
};

/**
 * Edit component for ESPN Game Score block
 */
export default function Edit({ attributes, setAttributes }) {
  const { sport, season, gameId, title, nameStyle } = attributes;
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [error, setError] = useState(null);

  // Fetch games when sport or season changes
  useEffect(() => {
    fetchGames(sport, season);
  }, [sport, season]);

  // Update selected game when gameId or games change
  useEffect(() => {
    if (games.length > 0) {
      if (gameId === 'latest') {
        // Find most recent completed or current game
        const now = new Date();
        const pastGames = games.filter((g) => new Date(g.date) <= now);
        const latest = pastGames.length > 0 ? pastGames[pastGames.length - 1] : games[0];
        setSelectedGame(latest);
      } else {
        const game = games.find((g) => g.id === gameId);
        setSelectedGame(game || null);
      }
    }
  }, [gameId, games]);

  /**
   * Fetch games from ESPN API
   */
  const fetchGames = async (sportType, seasonYear) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getScheduleUrl(sportType, seasonYear));

      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

      const data = await response.json();
      const transformedGames =
        data.events?.map((event) => {
          const competition = event.competitions?.[0];
          if (!competition) return null;

          const clemsonTeam = competition.competitors?.find(
            (c) => String(c.team?.id) === CLEMSON_TEAM_ID
          );
          const opponent = competition.competitors?.find(
            (c) => String(c.team?.id) !== CLEMSON_TEAM_ID
          );
          const isHome = clemsonTeam?.homeAway === 'home';

          // Extract team data with explicit name properties
          const clemsonTeamData = clemsonTeam?.team || {};
          const opponentTeamData = opponent?.team || {};

          return {
            id: event.id,
            date: event.date,
            name: event.name,
            shortName: event.shortName,
            isHome,
            status: event.status,
            clemson: {
              id: clemsonTeamData.id,
              displayName: clemsonTeamData.displayName,
              shortDisplayName: clemsonTeamData.shortDisplayName,
              name: clemsonTeamData.name,
              nickname: clemsonTeamData.nickname,
              location: clemsonTeamData.location,
              abbreviation: clemsonTeamData.abbreviation,
              color: clemsonTeamData.color,
              logos: clemsonTeamData.logos,
              logo: clemsonTeamData.logo,
              score: clemsonTeam?.score,
              record: clemsonTeam?.records?.[0]?.summary,
              rank: clemsonTeam?.curatedRank?.current,
            },
            opponent: {
              id: opponentTeamData.id,
              displayName: opponentTeamData.displayName,
              shortDisplayName: opponentTeamData.shortDisplayName,
              name: opponentTeamData.name,
              nickname: opponentTeamData.nickname,
              location: opponentTeamData.location,
              abbreviation: opponentTeamData.abbreviation,
              color: opponentTeamData.color,
              logos: opponentTeamData.logos,
              logo: opponentTeamData.logo,
              score: opponent?.score,
              record: opponent?.records?.[0]?.summary,
              rank: opponent?.curatedRank?.current,
            },
            venue: competition.venue,
            broadcasts: competition.broadcasts?.[0]?.names || [],
          };
        }).filter(Boolean) || [];

      setGames(transformedGames);
    } catch (err) {
      console.error('Failed to fetch games:', err);
      setError('Unable to load games. Please try again.');
    }

    setLoading(false);
  };

  /**
   * Format date for display
   */
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Get team color
   */
  const getTeamColor = (team, isClemson) => {
    if (isClemson) return CLEMSON_ORANGE;
    return team?.color ? `#${team.color}` : '#333333';
  };

  /**
   * Get sport label
   */
  const getSportLabel = () =>
    SPORTS.find((s) => s.value === sport)?.label || 'Football';

  const isFootball = sport === 'football';

  /**
   * Render team column
   */
  const renderTeamColumn = (team, isClemson, score) => {
    const teamColor = getTeamColor(team, isClemson);
    const rawRank = getDisplayValue(team?.rank);
    // Only show rank if it's 1-25 (ESPN uses 99 for unranked)
    const displayRank = rawRank && parseInt(rawRank, 10) <= 25 ? rawRank : null;
    const displayRecord = getDisplayValue(team?.record);
    const displayScore = getDisplayValue(score, '0');
    const logoUrl = getTeamLogo(team);
    // Get team name based on nameStyle setting
    const teamName = nameStyle === 'full'
      ? (team?.displayName || team?.shortDisplayName || team?.location || 'TBD')
      : (team?.shortDisplayName || team?.nickname || team?.location || 'TBD');

    return (
      <div className="espn-scorecard__team">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${teamName} logo`}
            className="espn-scorecard__logo"
          />
        ) : (
          <div
            className="espn-scorecard__logo-placeholder"
            style={{ backgroundColor: teamColor }}
          >
            {team?.abbreviation || '?'}
          </div>
        )}
        <div className="espn-scorecard__team-name" style={{ color: teamColor }}>
          {displayRank && (
            <span className="espn-scorecard__rank">#{displayRank} </span>
          )}
          {teamName}
        </div>
        <div className="espn-scorecard__record">{displayRecord}</div>
        {selectedGame?.status?.type?.state !== 'pre' && score !== undefined && (
          <div className="espn-scorecard__score" style={{ color: teamColor }}>
            {displayScore}
          </div>
        )}
      </div>
    );
  };

  /**
   * Get away and home teams based on game data
   */
  const getTeams = () => {
    if (!selectedGame) return { awayTeam: null, homeTeam: null };

    const awayTeam = selectedGame.isHome
      ? selectedGame.opponent
      : selectedGame.clemson;
    const homeTeam = selectedGame.isHome
      ? selectedGame.clemson
      : selectedGame.opponent;
    const awayScore = selectedGame.isHome
      ? selectedGame.opponent?.score
      : selectedGame.clemson?.score;
    const homeScore = selectedGame.isHome
      ? selectedGame.clemson?.score
      : selectedGame.opponent?.score;
    const awayIsClemson = !selectedGame.isHome;
    const homeIsClemson = selectedGame.isHome;

    return { awayTeam, homeTeam, awayScore, homeScore, awayIsClemson, homeIsClemson };
  };

  const { awayTeam, homeTeam, awayScore, homeScore, awayIsClemson, homeIsClemson } =
    getTeams();

  // Build game options for dropdown
  const gameOptions = [
    { label: 'Latest Game (Auto-select)', value: 'latest' },
    ...games.map((g) => ({
      label: `${g.isHome ? 'vs' : '@'} ${
        g.opponent?.displayName || g.opponent?.name || 'TBD'
      } - ${formatDate(g.date)}`,
      value: g.id,
    })),
  ];

  return (
    <>
      <InspectorControls>
        <PanelBody title="Display Settings" initialOpen={true}>
          <SelectControl
            label="Team Name Style"
            value={nameStyle}
            options={[
              { label: 'Short (e.g., Clemson)', value: 'short' },
              { label: 'Full (e.g., Clemson Tigers)', value: 'full' },
            ]}
            onChange={(value) => setAttributes({ nameStyle: value })}
            help="Choose how team names are displayed"
          />
          <TextControl
            label="Custom Title (optional)"
            value={title}
            onChange={(value) => setAttributes({ title: value })}
            placeholder={`Clemson ${getSportLabel()} Scoreboard`}
            help="Leave blank for default title"
          />
        </PanelBody>
      </InspectorControls>

      <div {...useBlockProps({ className: 'espn-score-block' })}>
        {/* Inline Controls */}
        <div className="espn-score-controls">
          <div className="espn-score-controls__row">
            <div className="espn-score-controls__field">
              <label>Sport</label>
              <SelectControl
                value={sport}
                options={SPORTS}
                onChange={(value) =>
                  setAttributes({ sport: value, gameId: 'latest' })
                }
              />
            </div>
            <div className="espn-score-controls__field">
              <label>Season</label>
              <SelectControl
                value={season}
                options={SEASONS}
                onChange={(value) =>
                  setAttributes({ season: value, gameId: 'latest' })
                }
              />
            </div>
            <div className="espn-score-controls__field espn-score-controls__field--wide">
              <label>Game</label>
              <SelectControl
                value={gameId}
                options={gameOptions}
                onChange={(value) => setAttributes({ gameId: value })}
              />
            </div>
          </div>
        </div>

        {/* Scorecard Preview */}
        {loading ? (
          <Placeholder icon="awards" label="ESPN Game Score">
            <Spinner />
            <p>Loading games...</p>
          </Placeholder>
        ) : error ? (
          <Placeholder icon="warning" label="ESPN Game Score">
            <p>{error}</p>
          </Placeholder>
        ) : selectedGame ? (
          <div className="espn-scorecard">
            {/* Header */}
            <h2 className="espn-scorecard__title">
              {title || `Clemson ${getSportLabel()} Scoreboard`}
            </h2>

            {/* Three-column layout */}
            <div className="espn-scorecard__content">
              {/* Away Team */}
              {renderTeamColumn(awayTeam, awayIsClemson, awayScore)}

              {/* Center Info */}
              <div className="espn-scorecard__info">
                {isFootball && (
                  <>
                    <div className="espn-scorecard__period-label">QUARTER</div>
                    <div className="espn-scorecard__dots">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span
                          key={i}
                          className={`espn-scorecard__dot ${
                            selectedGame.status?.type?.completed
                              ? ''
                              : i < (selectedGame.status?.period || 0)
                              ? 'espn-scorecard__dot--active'
                              : ''
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="espn-scorecard__status">
                  {selectedGame.status?.type?.shortDetail ||
                    selectedGame.status?.type?.description ||
                    'Scheduled'}
                </div>
                <div className="espn-scorecard__date">
                  {formatDate(selectedGame.date)}
                </div>
                {selectedGame.venue && (
                  <>
                    <div className="espn-scorecard__venue">
                      {selectedGame.venue?.address?.city?.toUpperCase() || ''}
                    </div>
                    <div className="espn-scorecard__venue">
                      {selectedGame.venue?.fullName?.toUpperCase() || ''}
                    </div>
                  </>
                )}
                {selectedGame.broadcasts?.length > 0 && (
                  <div className="espn-scorecard__broadcast">
                    Watch on: <span>{selectedGame.broadcasts[0]}</span>
                  </div>
                )}
              </div>

              {/* Home Team */}
              {renderTeamColumn(homeTeam, homeIsClemson, homeScore)}
            </div>

            {/* Bottom border */}
            <div className="espn-scorecard__border" />
          </div>
        ) : (
          <Placeholder icon="awards" label="ESPN Game Score">
            <p>Select a sport and game to preview the scoreboard.</p>
          </Placeholder>
        )}
      </div>
    </>
  );
}
