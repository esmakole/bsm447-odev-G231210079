import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function EmptyState({ symbol = '⌕', title, description }) {
  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 58, paddingHorizontal: 26 },
  symbol: { color: colors.blue, fontSize: 46, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: '800', color: colors.navy, textAlign: 'center' },
  description: { marginTop: 8, color: colors.muted, textAlign: 'center', lineHeight: 21 },
});
