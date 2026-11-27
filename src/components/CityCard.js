import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { citySubtitle } from '../utils/weather';

export default function CityCard({ city, onPress, saved = false }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.icon}><Text style={styles.iconText}>⌖</Text></View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{city.name}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{citySubtitle(city)}</Text>
      </View>
      {saved ? <Text style={styles.bookmark}>★</Text> : null}
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: 14,
    borderRadius: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  pressed: { opacity: 0.7 },
  icon: { height: 46, width: 46, borderRadius: 15, backgroundColor: colors.pale,
    justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconText: { color: colors.blue, fontSize: 29, fontWeight: '700' },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '800', color: colors.text },
  subtitle: { marginTop: 4, fontSize: 12, color: colors.muted },
  bookmark: { fontSize: 17, color: colors.blue, marginHorizontal: 6 },
  arrow: { marginLeft: 6, fontSize: 27, color: colors.muted },
});
