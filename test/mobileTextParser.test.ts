import { describe, expect, it } from 'vitest';

import { parseMobileTextMatches } from '../src/utils/mobileTextParser';

describe('parseMobileTextMatches', () => {
  it('plain text bloktan maçları parse eder', () => {
    const text = `
AVRUPA: Şampiyonlar Ligi - Playofflar
20:45Atl. Madrid - Club Brugge -:-
23:00Inter - Bodo/Glimt -:-
İNGİLTERE: Premier League Puan durumu
23:00Everton - Manchester Utd 0:1
76'Ypiranga AP - Santos AP 1:2
`;

    const parsed = parseMobileTextMatches(text);

    expect(parsed.length).toBeGreaterThan(2);
    expect(parsed[0]).toMatchObject({
      league: 'AVRUPA: Şampiyonlar Ligi - Playofflar',
      homeTeam: 'Atl. Madrid',
      awayTeam: 'Club Brugge',
      status: 'not_started'
    });

    expect(parsed[2]).toMatchObject({
      league: 'İNGİLTERE: Premier League',
      homeTeam: 'Everton',
      awayTeam: 'Manchester Utd',
      homeScore: 0,
      awayScore: 1
    });
  });
});
