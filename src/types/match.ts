export type MatchStatus = 'not_started' | 'live' | 'finished' | 'postponed' | 'unknown';

export interface Match {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  minute: string | null;
  status: MatchStatus;
  kickoffTime: string | null;
}
