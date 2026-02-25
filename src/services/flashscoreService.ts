import { Match } from '../types/match';
import { parseFlashscoreFeed } from '../utils/flashscoreParser';
import { parseMobileTextMatches } from '../utils/mobileTextParser';
import { buildLiveFeedCandidates, buildMatchStatsFeedUrl } from '../utils/flashscoreUrls';

const DEFAULT_HEADERS: HeadersInit = {
  Accept: '*/*',
  Origin: 'https://m.flashscore.com.tr',
  Referer: 'https://m.flashscore.com.tr/',
  'X-Fsign': 'SW9D1eZo',
  'X-GeoIP': '1'
};

export class FlashscoreService {
  constructor(
    private readonly feedCandidates = buildLiveFeedCandidates(),
    private readonly headers: HeadersInit = DEFAULT_HEADERS
  ) {}

  private readonly mobileUrl = 'https://m.flashscore.com.tr/';

  async getLiveMatches(): Promise<Match[]> {
    let lastError: Error | null = null;

    for (const url of this.feedCandidates) {
      try {
        const matches = await this.fetchAndParse(url);

        if (matches.length > 0) {
          return matches;
        }
      } catch (error) {
        lastError = error as Error;
      }
    }

    const mobileMatches = await this.fetchMobileMatches();
    if (mobileMatches.length > 0) {
      return mobileMatches;
    }

    if (lastError) {
      throw lastError;
    }

    return [];
  }

  async getMatchStatsRaw(matchId: string): Promise<string> {
    const url = buildMatchStatsFeedUrl(matchId);
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`İstatistik feed isteği başarısız: ${response.status}`);
    }

    return response.text();
  }

  private async fetchMobileMatches(): Promise<Match[]> {
    try {
      const response = await fetch(this.mobileUrl, {
        headers: {
          ...this.headers,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      if (!response.ok) {
        return [];
      }

      const html = await response.text();
      return parseMobileTextMatches(html);
    } catch {
      return [];
    }
  }

  private async fetchAndParse(url: string): Promise<Match[]> {
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Feed isteği başarısız (${url}): ${response.status}`);
    }

    const feed = await response.text();
    return parseFlashscoreFeed(feed);
  }
}
