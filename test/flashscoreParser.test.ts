import { describe, expect, it } from 'vitest';

import { parseFlashscoreFeed } from '../src/utils/flashscoreParser';

describe('parseFlashscoreFeed', () => {
  it('u0001 ayracıyla gelen feed satırlarını Match listesine dönüştürür', () => {
    const raw =
      '\u0001AA÷MATCH_1\u0001AB÷FOOTBALL\u0001AD÷Süper Lig\u0001AE÷Galatasaray\u0001AF÷Fenerbahçe\u0001AG÷2\u0001AH÷1\u0001AC÷LIVE\u0001BA÷67\'';

    const parsed = parseFlashscoreFeed(raw);

    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({
      id: 'MATCH_1',
      league: 'Süper Lig',
      homeTeam: 'Galatasaray',
      awayTeam: 'Fenerbahçe',
      homeScore: 2,
      awayScore: 1,
      status: 'live'
    });
  });

  it('¬ ve ~ ayracıyla gelen feed formatını parse eder', () => {
    const raw =
      '¬~AA÷M2¬AB÷FOOTBALL¬AD÷Premier League¬AE÷Arsenal¬AF÷Chelsea¬AG÷1¬AH÷0¬AC÷2¬BA÷35\'';

    const parsed = parseFlashscoreFeed(raw);

    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({
      id: 'M2',
      league: 'Premier League',
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
      status: 'live'
    });
  });

  it('boş string için boş dizi döndürür', () => {
    expect(parseFlashscoreFeed('  ')).toEqual([]);
  });
});
