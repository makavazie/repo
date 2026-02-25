import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Match } from '../types/match';

interface MatchCardProps {
  match: Match;
}

const statusLabel: Record<Match['status'], string> = {
  not_started: 'Başlamadı',
  live: 'Canlı',
  finished: 'Bitti',
  postponed: 'Ertelendi',
  unknown: 'Bilinmiyor'
};

function initialFromTeam(team: string): string {
  return team.trim().charAt(0).toUpperCase() || '?';
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.league}>{match.league || 'Genel'}</Text>
        <Text style={[styles.badge, match.status === 'live' ? styles.liveBadge : undefined]}>{statusLabel[match.status]}</Text>
      </View>

      <View style={styles.teamRow}>
        <View style={styles.teamWrap}>
          <View style={styles.logoCircle}><Text style={styles.logoText}>{initialFromTeam(match.homeTeam)}</Text></View>
          <Text style={styles.team}>{match.homeTeam}</Text>
        </View>
        <Text style={styles.score}>{match.homeScore ?? '-'}</Text>
      </View>

      <View style={styles.teamRow}>
        <View style={styles.teamWrap}>
          <View style={styles.logoCircle}><Text style={styles.logoText}>{initialFromTeam(match.awayTeam)}</Text></View>
          <Text style={styles.team}>{match.awayTeam}</Text>
        </View>
        <Text style={styles.score}>{match.awayScore ?? '-'}</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.meta}>{match.minute ?? match.kickoffTime ?? 'Saat bilgisi yok'}</Text>
        <Text style={styles.meta}>{match.id}</Text>
      </View>

      <Text style={styles.inlineInfo}>Detay ekranı uygulama içinde kalacak (dış siteye yönlendirme kapalı).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  league: {
    fontWeight: '600',
    color: '#1e293b',
    flexShrink: 1,
    marginRight: 8
  },
  badge: {
    fontSize: 12,
    color: '#1d4ed8',
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  liveBadge: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2'
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  teamWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    gap: 8
  },
  logoCircle: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    fontWeight: '700',
    color: '#334155',
    fontSize: 12
  },
  team: {
    fontSize: 16,
    color: '#0f172a',
    flex: 1
  },
  score: {
    fontSize: 20,
    fontWeight: '700',
    color: '#020617',
    minWidth: 24,
    textAlign: 'right'
  },
  footerRow: {
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  meta: {
    color: '#64748b',
    fontSize: 12
  },
  inlineInfo: {
    color: '#64748b',
    fontSize: 11
  }
});
