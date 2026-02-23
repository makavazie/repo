import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Match } from '../types/match';
import { buildMatchH2HUrl, buildMatchPageUrl, buildMatchStatsFeedUrl } from '../utils/flashscoreUrls';

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

export function MatchCard({ match }: MatchCardProps) {
  const onOpen = async (url: string) => {
    await Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.league}>{match.league || match.sport}</Text>
        <Text style={[styles.badge, match.status === 'live' ? styles.liveBadge : undefined]}>{statusLabel[match.status]}</Text>
      </View>

      <View style={styles.teamRow}>
        <Text style={styles.team}>{match.homeTeam}</Text>
        <Text style={styles.score}>{match.homeScore ?? '-'}</Text>
      </View>
      <View style={styles.teamRow}>
        <Text style={styles.team}>{match.awayTeam}</Text>
        <Text style={styles.score}>{match.awayScore ?? '-'}</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.meta}>{match.minute ?? match.kickoffTime ?? 'Saat bilgisi yok'}</Text>
        <Text style={styles.meta}>{match.id}</Text>
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.actionBtn} onPress={() => onOpen(buildMatchPageUrl(match.id))}>
          <Text style={styles.actionText}>Maç Sayfası</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => onOpen(buildMatchH2HUrl(match.id))}>
          <Text style={styles.actionText}>H2H</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => onOpen(buildMatchStatsFeedUrl(match.id))}>
          <Text style={styles.actionText}>İstatistik Feed</Text>
        </Pressable>
      </View>
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
    color: '#1e293b'
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
    justifyContent: 'space-between'
  },
  team: {
    fontSize: 16,
    color: '#0f172a',
    flex: 1,
    marginRight: 8
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
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  actionBtn: {
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  actionText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '600'
  }
});
