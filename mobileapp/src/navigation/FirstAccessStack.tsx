import { CardStyleInterpolators, createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import CreateWallet from '../pages/FirstAccess/CreateWallet/CreateWallet'
import MnemonicViewerRecoverWallet from '../pages/FirstAccess/MnemonicViewerRecoverWallet/MnemonicViewerRecoverWallet'
import AddGuardian from '../pages/FirstAccess/AddGuardian/AddGuardian'
import RecoverWallet from '../pages/FirstAccess/RecoverWallet/RecoverWallet'
import MnemonicViewerNewWallet from '../pages/FirstAccess/MnemonicViewerNewWallet/MnemonicViewerNewWallet'

///////////
// TYPES //
///////////
/**
 * FirstAccessStackParamList is a type that represents the possible routes
 * If undefined, it means that the route doesn't have any params
 */
type FirstAccessStackParamList = {
  CreateWallet: undefined
  MnemonicViewerNewWallet: {
    mnemonic: string[]
  }
  MnemonicViewerRecoverWallet: {
    mnemonic: string[]
    data: any
  }
  AddGuardian: undefined
  RecoverWallet: undefined
}

// Steps: //FIXME
// 1. When Pressed on "Create Wallet" button it generate the new eoaAddress/private keys and set it to the walletContext
// 2. pass the mnemonic to the MnemonicViewer
// 3. then when pressed on "I saved these words" it goes to the AddGuardian screen that will send the request to the server to create the contract wallet

export type MnemonicViewerNewWalletProps = StackScreenProps<FirstAccessStackParamList, 'MnemonicViewerNewWallet'>

export type MnemonicViewerRecoverWalletProps = StackScreenProps<
  FirstAccessStackParamList,
  'MnemonicViewerRecoverWallet'
>

export type CreateWalletProps = StackScreenProps<FirstAccessStackParamList, 'CreateWallet'>

export type AddGuardianProps = StackScreenProps<FirstAccessStackParamList, 'AddGuardian'>

export type RecoverWalletProps = StackScreenProps<FirstAccessStackParamList, 'RecoverWallet'>

////////////////
// NAVIGATION //
////////////////

const { Navigator, Screen } = createStackNavigator<FirstAccessStackParamList>()

const FirstAccessStackNavigator = () => {
  return (
    <Navigator
      initialRouteName="CreateWallet"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Screen name="CreateWallet" component={CreateWallet} />
      <Screen name="RecoverWallet" component={RecoverWallet} />
      <Screen name="MnemonicViewerNewWallet" component={MnemonicViewerNewWallet} />
      <Screen name="MnemonicViewerRecoverWallet" component={MnemonicViewerRecoverWallet} />
      <Screen name="AddGuardian" component={AddGuardian} />
    </Navigator>
  )
}

export default FirstAccessStackNavigator
