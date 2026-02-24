import { Match } from '../types/match';

const LEAGUE_LINE = /^[^\d\n][^\n]*:\s+[^\n]+$/;
const MATCH_LINE = /^(?<time>\d{1,2}:\d{2}|\d{1,3}'|Devre Arası|Ertelendi)?\s*(?<home>[^-\n]+?)\s-\s(?<away>[^\n\d]+?)\s(?<score>-:-|\d+:\d+)$/;

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
    .replace(/<script[\s\S]*?<\/script>/gi, '\n')
    .replace(/<style[\s\S]*?<\/style>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function normalizeLine(line: string): string {
  return line
    .replace(/^(\d{1,2}:\d{2})([A-Za-zÇĞİÖŞÜçğıöşü])/u, '$1 $2')
    .replace(/^(\d{1,2}:\d{2})Ertelendi/u, '$1 Ertelendi ')
    .replace(/^Devre Arası([A-Za-zÇĞİÖŞÜçğıöşü])/u, 'Devre Arası $1')
    .trim();
}

export function parseMobileTextMatches(raw: string): Match[] {
  const clean = raw.includes('<html') ? stripHtml(raw) : raw;
  const lines = clean
    .replace(/\u00a0/g, ' ')
    .split('\n')
    .map((line) => normalizeLine(line.trim()))
    .filter(Boolean);

  const matches: Match[] = [];
  let currentLeague = 'Genel';

  for (const line of lines) {
    if (LEAGUE_LINE.test(line) && !line.includes(' - ') && !line.startsWith('Özet') && !line.startsWith('Oranlar')) {
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
