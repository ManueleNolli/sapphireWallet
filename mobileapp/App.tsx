import 'react-native-gesture-handler' // MUST be before react navigation

import * as eva from '@eva-design/eva'
import { default as theme } from './assets/theme/theme.json'
import {
  ApplicationProvider,
  Layout,
  Text,
  IconRegistry,
  Icon,
  Button,
  BottomNavigation,
  BottomNavigationTab,
  IconElement,
  BottomNavigationProps,
} from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'

import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'

// Pages
import { HomeScreen } from './src/pages/home/home'
import { DetailsScreen } from './src/pages/details/details'

// Navigation
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
const { Navigator, Screen } = createBottomTabNavigator()

const PersonIcon = (props: any): IconElement => (
  <Icon {...props} name="person-outline" />
)

const BellIcon = (props: any): IconElement => (
  <Icon {...props} name="bell-outline" />
)

const EmailIcon = (props: any): IconElement => (
  <Icon {...props} name="email-outline" />
)

const useBottomNavigationState = (initialState = 0): BottomNavigationProps => {
  const [selectedIndex, setSelectedIndex] = React.useState(initialState)
  return { selectedIndex, onSelect: setSelectedIndex }
}

export const BottomNavigationAccessoriesShowcase = (): React.ReactElement => {
  const topState = useBottomNavigationState()

  return (
    <BottomNavigation style={styles.bottomNavigation} {...topState}>
      <BottomNavigationTab title="USERS" icon={PersonIcon} />
      <BottomNavigationTab title="ORDERS" icon={BellIcon} />
    </BottomNavigation>
  )
}

const BottomTabBar = ({ navigation, state }: any) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title="HOME" icon={BellIcon} />
    <BottomNavigationTab title="DETAILS" icon={PersonIcon} />
  </BottomNavigation>
)

const TabNavigator = () => (
  <Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <BottomTabBar {...props} />}
  >
    <Screen name="Home" component={HomeScreen} />
    <Screen name="Details" component={DetailsScreen} />
  </Navigator>
)

export default function App() {
  return (
    <NavigationContainer>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
        <StatusBar style="auto" />
        <TabNavigator />
      </ApplicationProvider>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 8,
  },
})
