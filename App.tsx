import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { MatchCard } from './src/components/MatchCard';
import { FlashscoreService } from './src/services/flashscoreService';
import { Match } from './src/types/match';

const flashscoreService = new FlashscoreService();

export default function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    setError(null);

    try {
      const liveMatches = await flashscoreService.getLiveMatches();
      setMatches(liveMatches);
    } catch (err) {
      setError('Veriler alınamadı. Endpoint erişimini veya CORS/proxy ayarlarını kontrol edin.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Canlı Skor Takip</Text>
        <Text style={styles.subtitle}>Kaynak: flashscore live feed (fallback destekli)</Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.info}>Maçlar yükleniyor...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => {
            setIsRefreshing(true);
            loadMatches();
          }} />}
        >
          {error && <Text style={styles.error}>{error}</Text>}

          {matches.length === 0 ? (
            <Text style={styles.info}>Şu an listelenecek maç bulunamadı.</Text>
          ) : (
            matches.map((match) => <MatchCard key={match.id} match={match} />)
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb'
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a'
  },
  subtitle: {
    marginTop: 4,
    color: '#475569'
  },
  scrollContent: {
    padding: 16,
    gap: 12
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  info: {
    color: '#475569'
  },
  error: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 10
  }
});
