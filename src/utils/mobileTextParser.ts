import { Match } from '../types/match';

const LEAGUE_LINE = /^[A-ZÇĞİÖŞÜ&\s\.\-]+:\s.+/;
const MATCH_LINE = /^(?<time>\d{1,2}:\d{2}|\d{1,3}'|Devre Arası|Ertelendi)?\s*(?<home>[^-\n]+?)\s-\s(?<away>[^\d\n]+?)\s(?<score>-:-|\d+:\d+)$/;

function toStatus(timeOrState: string | undefined, score: string) {
  if (timeOrState?.includes("'")) {
    return 'live' as const;
  }

  if (timeOrState?.toLowerCase().includes('devre')) {
    return 'live' as const;
  }

  if (timeOrState?.toLowerCase().includes('ertelendi')) {
    return 'postponed' as const;
  }

  if (score === '-:-') {
    return 'not_started' as const;
  }

  return 'finished' as const;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseMobileTextMatches(raw: string): Match[] {
  const clean = raw.includes('<html') ? stripHtml(raw) : raw;
  const lines = clean
    .replace(/\u00a0/g, ' ')
    .split(/(?=\d{1,2}:\d{2}|\d{1,3}'|Devre Arası|Ertelendi|[A-ZÇĞİÖŞÜ&\s\.\-]+:\s)/)
    .map((line) => line.trim())
    .filter(Boolean);

  const matches: Match[] = [];
  let currentLeague = 'Bilinmeyen Lig';

  for (const line of lines) {
    if (LEAGUE_LINE.test(line) && !line.includes(' - ')) {
      currentLeague = line.replace(/\s*Puan durumu$/i, '').trim();
      continue;
    }

    const parsed = line.match(MATCH_LINE);
    if (!parsed?.groups) {
      continue;
    }

    const score = parsed.groups.score;
    const [homeScore, awayScore] = score === '-:-' ? [null, null] : score.split(':').map((v) => Number(v));
    const kickoff = parsed.groups.time ?? null;

    matches.push({
      id: `mobile-${matches.length}`,
      sport: 'FOOTBALL',
      league: currentLeague,
      homeTeam: parsed.groups.home.trim(),
      awayTeam: parsed.groups.away.trim(),
      homeScore,
      awayScore,
      minute: kickoff?.includes("'") ? kickoff : null,
      kickoffTime: kickoff && !kickoff.includes("'") ? kickoff : null,
      status: toStatus(kickoff, score)
    });
  }

  return matches;
}
