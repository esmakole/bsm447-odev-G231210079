import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/SearchScreen';
import DetailScreen from '../screens/DetailScreen';
import SavedScreen from '../screens/SavedScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.blue,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: { backgroundColor: colors.white, height: 66, paddingTop: 8, paddingBottom: 8,
        borderTopColor: colors.border },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '800' },
    }}>
      <Tab.Screen name="Search" component={SearchScreen}
        options={{ title: 'Şehirler', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 25 }}>⌕</Text> }} />
      <Tab.Screen name="Saved" component={SavedScreen}
        options={{ title: 'Kaydedilenler', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 23 }}>☆</Text> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerTintColor: colors.navy,
        headerStyle: { backgroundColor: colors.white },
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.background },
      }}>
        <Stack.Screen name="Home" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen}
          options={({ route }) => ({ title: route.params?.city?.name || 'Rüzgâr tahmini' })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
