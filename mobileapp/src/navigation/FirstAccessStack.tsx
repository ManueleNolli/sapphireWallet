import { CardStyleInterpolators, createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import CreateWallet from '../pages/FirstAccess/CreateWallet/CreateWallet'
import MnemonicViewer from '../pages/FirstAccess/MnemonicViewer/MnemonicViewer'
import AddGuardian from '../pages/FirstAccess/AddGuardian/AddGuardian'

///////////
// TYPES //
///////////
/**
 * FirstAccessStackParamList is a type that represents the possible routes
 * If undefined, it means that the route doesn't have any params
 */
type FirstAccessStackParamList = {
  CreateWallet: undefined
  MnemonicViewer: {
    mnemonic: string[]
  }
  AddGuardian: undefined
}

// Steps:
// 1. When Pressed on "Create Wallet" button it generate the new eoaAddress/private keys and set it to the walletContext
// 2. pass the mnemonic to the MnemonicViewer
// 3. then when pressed on "I saved these words" it goes to the AddGuardian screen that will send the request to the server to create the contract wallet

export type MnemonicViewerProps = StackScreenProps<FirstAccessStackParamList, 'MnemonicViewer'>

export type CreateWalletProps = StackScreenProps<FirstAccessStackParamList, 'CreateWallet'>

export type AddGuardianProps = StackScreenProps<FirstAccessStackParamList, 'AddGuardian'>

////////////////
// NAVIGATION //
////////////////

const { Navigator, Screen } = createStackNavigator<FirstAccessStackParamList>()

const FirstAccessStackNavigator = () => (
  <Navigator
    initialRouteName="CreateWallet"
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
  >
    <Screen name="CreateWallet" component={CreateWallet} />
    <Screen name="MnemonicViewer" component={MnemonicViewer} />
    <Screen name="AddGuardian" component={AddGuardian} />
  </Navigator>
)
export default FirstAccessStackNavigator
