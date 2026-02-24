import { Match, MatchStatus } from '../types/match';

const KEY_MAP = {
  id: 'AA',
  sport: 'AB',
  league: 'AD',
  homeTeam: 'AE',
  awayTeam: 'AF',
  homeScore: 'AG',
  awayScore: 'AH',
  minute: 'BA',
  status: 'AC',
  kickoffTime: 'AT'
} as const;

const STATUS_MAP: Record<string, MatchStatus> = {
  LIVE: 'live',
  FINISHED: 'finished',
  NOT_STARTED: 'not_started',
  POSTPONED: 'postponed',
  1: 'not_started',
  2: 'live',
  3: 'finished'
};

function getField(record: string, key: string): string | null {
  const regexp = new RegExp(`(?:^|¬)${key}÷([^¬]*)`);
  const match = record.match(regexp);
  return match?.[1] ?? null;
}

function normalizeStatus(rawStatus: string | null): MatchStatus {
  if (!rawStatus) {
    return 'unknown';
  }

  return STATUS_MAP[rawStatus] ?? 'unknown';
}

function toNullableNumber(value: string | null): number | null {
  if (value == null || value === '') {
    return null;
  }

  const converted = Number(value);
  return Number.isNaN(converted) ? null : converted;
}

function splitRecords(rawText: string): string[] {
  const normalized = rawText
    .replace(/\u0001/g, '¬')
    .replace(/~+/g, '\n')
    .trim();

  if (!normalized) {
    return [];
  }

  return normalized
    .split('\n')
    .map((line) => line.replace(/^¬+/, '').trim())
    .filter((line) => line.includes('AA÷'));
}

export function parseFlashscoreFeed(rawText: string): Match[] {
  const records = splitRecords(rawText);

  return records.map((record, index) => ({
    id: getField(record, KEY_MAP.id) ?? `match-${index}`,
    sport: getField(record, KEY_MAP.sport) ?? 'FOOTBALL',
    league: getField(record, KEY_MAP.league) ?? 'Bilinmeyen Lig',
    homeTeam: getField(record, KEY_MAP.homeTeam) ?? 'Ev Sahibi',
    awayTeam: getField(record, KEY_MAP.awayTeam) ?? 'Deplasman',
    homeScore: toNullableNumber(getField(record, KEY_MAP.homeScore)),
    awayScore: toNullableNumber(getField(record, KEY_MAP.awayScore)),
    minute: getField(record, KEY_MAP.minute),
    status: normalizeStatus(getField(record, KEY_MAP.status)),
    kickoffTime: getField(record, KEY_MAP.kickoffTime)
  }));
}
