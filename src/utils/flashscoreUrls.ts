const MOBILE_BASE_URL = 'https://m.flashscore.com.tr';
const FEED_BASE_URL = 'https://global.flashscore.ninja';

export function buildMatchPageUrl(matchId: string): string {
  return `${MOBILE_BASE_URL}/mac/${matchId}/`;
}

export function buildMatchH2HUrl(matchId: string): string {
  return `${MOBILE_BASE_URL}/mac/${matchId}/?t=h2h`;
}

export function buildMatchStatsFeedUrl(matchId: string): string {
  return `${FEED_BASE_URL}/10/x/feed/df_st_1_${matchId}`;
}

export function buildLiveFeedCandidates(): string[] {
  return [
    `${FEED_BASE_URL}/310/x/feed/f_`,
    `${FEED_BASE_URL}/10/x/feed/f_`
  ];
}
