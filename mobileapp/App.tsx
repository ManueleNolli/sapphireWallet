import './global'
import 'react-native-gesture-handler' // MUST be before react navigation

// UI Kitten
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { IconRegistry } from '@ui-kitten/components'

// Providers
import { ThemeProvider } from './src/providers/ThemeProvider'
import { WalletProvider } from './src/providers/WalletProvider'
import { FirstAccessProvider } from './src/providers/FirstAccessProvider'

// Status Bar
import { StatusBar } from 'expo-status-bar'

// Navigation
import { NavigationContainer } from '@react-navigation/native'
import BottomTabNavigator from './src/navigation/BottomTab'
import { BlockchainProvider } from './src/providers/BlockchainProvider'

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <IconRegistry icons={EvaIconsPack} />
        <ThemeProvider>
          <WalletProvider>
            <FirstAccessProvider>
              <BlockchainProvider>
                <BottomTabNavigator />
              </BlockchainProvider>
            </FirstAccessProvider>
          </WalletProvider>
        </ThemeProvider>
      </NavigationContainer>
    </>
  )
}
