import 'react-native-gesture-handler' // MUST be before react navigation

// UI Kitten
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import {
  IconRegistry,
  Icon,
  BottomNavigation,
  BottomNavigationTab,
  IconElement,
} from '@ui-kitten/components'

// Theme and style
import { ThemeProvider } from './src/providers/themeProvider'

// Status Bar
import { StatusBar } from 'expo-status-bar'

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
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <IconRegistry icons={EvaIconsPack} />
        <ThemeProvider>
          <TabNavigator />
        </ThemeProvider>
      </NavigationContainer>
    </>
  )
}
