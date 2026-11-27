import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, Pressable,
  StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchCities } from '../api/openMeteo';
import CityCard from '../components/CityCard';
import EmptyState from '../components/EmptyState';
import { useSaved } from '../context/SavedContext';
import { colors } from '../theme/colors';
import { normalizeText } from '../utils/weather';

const DEFAULT_QUERY = 'İstanbul';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const { saved } = useSaved();

  useEffect(() => {
    const controller = new AbortController();
    // Arama boşsa şehir önerileri gelir; hepsi de canlı API yanıtıdır.
    const term = query.trim() || DEFAULT_QUERY;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const result = await searchCities(term, controller.signal);
        if (!controller.signal.aborted) setCities(result);
      } catch (err) {
        if (!controller.signal.aborted) {
          setCities([]);
          setError('Bağlantı yok veya veri alınamadı.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, query ? 400 : 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, retryCount]);

  const visibleCities = useMemo(() => {
    // API yazım alternatifi döndürebilir. Türkçe harf duyarsız karşılaştırma
    // için, kullanıcı sorgusu doğrudan şehrin adında geçiyorsa ayrıca filtrelenir.
    if (!query.trim()) return cities;
    const needle = normalizeText(query);
    return cities.filter((city) => normalizeText(city.name).includes(needle));
  }, [cities, query]);

  return (
  <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}> 
      <FlatList
        style={styles.list}
        data={visibleCities}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              <Text style={styles.eyebrow}>RÜZGÂR ATLASI · K12-C</Text>
              <Text style={styles.heading}>Rüzgârı keşfet.</Text>
              <Text style={styles.intro}>Bir şehir ara, önündeki 7 günün rüzgâr tahminlerini incele.</Text>
              <View style={styles.searchRow}>
                <Text style={styles.searchIcon}>⌕</Text>
                <TextInput
                  style={styles.input}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Şehir ara..."
                  placeholderTextColor="#8D9BAE"
                  autoCorrect={false}
                  autoCapitalize="words"
                  returnKeyType="search"
                  onSubmitEditing={Keyboard.dismiss}
                  accessibilityLabel="Şehir ara"
                />
                {query.length > 0 && (
                  <Pressable accessibilityRole="button" accessibilityLabel="Aramayı temizle"
                    onPress={() => setQuery('')} style={styles.clearButton}>
                    <Text style={styles.clearText}>×</Text>
                  </Pressable>
                )}
              </View>
            </View>
            <View style={styles.section}>
              <View>
                <Text style={styles.sectionTitle}>{query.trim() ? 'Arama sonuçları' : 'Önerilen şehirler'}</Text>
                <Text style={styles.sectionCaption}>Open-Meteo canlı şehir verileri</Text>
              </View>
              <View style={styles.counter}><Text style={styles.counterText}>{loading ? '…' : visibleCities.length} kayıt</Text></View>
            </View>
          </View>
        }
        renderItem={({ item }) => <CityCard city={item}
          saved={saved.some((city) => city.id === item.id)}
          onPress={() => navigation.navigate('Detail', { city: item })} />}
        ListEmptyComponent={loading
          ? <View style={styles.center}><ActivityIndicator size="large" color={colors.blue} /><Text style={styles.hint}>Yükleniyor…</Text></View>
          : error
            ? <View style={styles.center}><EmptyState symbol="!" title="Bağlantı yok" description={error} />
                <Pressable onPress={() => setRetryCount((count) => count + 1)} style={styles.retry}>
                  <Text style={styles.retryText}>Tekrar dene</Text>
                </Pressable></View>
            : <EmptyState title="Sonuç bulunamadı" description="Başka bir şehir adı deneyin." />}
        ListFooterComponent={<Text style={styles.footer}>Veri: Open-Meteo · G231210079</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { flex: 1 },
  content: { paddingBottom: 26, flexGrow: 1, paddingHorizontal: 18 },
  hero: { backgroundColor: colors.navy, borderRadius: 26, padding: 24, marginTop: 12, marginBottom: 23 },
  eyebrow: { color: colors.cyan, fontSize: 10, fontWeight: '900', letterSpacing: 1.9 },
  heading: { color: colors.white, fontSize: 31, fontWeight: '900', marginTop: 9 },
  intro: { color: '#B6CBDD', lineHeight: 21, fontSize: 13, marginTop: 9, marginBottom: 21 },
  searchRow: { flexDirection: 'row', backgroundColor: colors.white, alignItems: 'center',
    borderRadius: 15, height: 54, paddingHorizontal: 13 },
  searchIcon: { color: colors.blue, fontSize: 30, marginRight: 9, marginTop: -4 },
  input: { flex: 1, height: 54, fontSize: 15, color: colors.text },
  clearButton: { paddingHorizontal: 8, paddingVertical: 6 },
  clearText: { color: colors.muted, fontSize: 26 },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.navy },
  sectionCaption: { color: colors.muted, fontSize: 11, marginTop: 4 },
  counter: { backgroundColor: '#DBEFFF', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 12 },
  counterText: { color: colors.blue, fontWeight: '800', fontSize: 12 },
  center: { alignItems: 'center' },
  hint: { color: colors.muted, marginTop: 10 },
  retry: { backgroundColor: colors.blue, paddingVertical: 13, paddingHorizontal: 30, borderRadius: 12 },
  retryText: { color: colors.white, fontWeight: '800' },
  footer: { marginTop: 25, textAlign: 'center', fontSize: 11, color: colors.muted },
});
