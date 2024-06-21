import './global'
import 'react-native-gesture-handler' // MUST be before react navigation

import { LogBox } from 'react-native'
LogBox.ignoreLogs(['Warning: ...']) // Ignore log notification by message

// UI Kitten
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { IconRegistry, ModalService } from '@ui-kitten/components'
ModalService.setShouldUseTopInsets = true //applies StatusBar additional offset

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

// Toast
import Toast from 'react-native-toast-message'

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <IconRegistry icons={EvaIconsPack} />
        <ThemeProvider>
          <WalletProvider>
            <BlockchainProvider>
              <FirstAccessProvider>
                <BottomTabNavigator />
              </FirstAccessProvider>
            </BlockchainProvider>
          </WalletProvider>
        </ThemeProvider>
      </NavigationContainer>
      <Toast />
    </>
  )
}
