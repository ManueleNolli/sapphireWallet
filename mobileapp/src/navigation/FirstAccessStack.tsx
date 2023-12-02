import {
  CardStyleInterpolators,
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack'
import CreateWallet from '../pages/FirstAccess/CreateWallet/CreateWallet'
import MnemonicViewer from '../pages/FirstAccess/MnemonicViewer/MnemonicViewer'

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
}

export type MnemonicViewerProps = StackScreenProps<
  FirstAccessStackParamList,
  'MnemonicViewer'
>

export type CreateWalletProps = StackScreenProps<
  FirstAccessStackParamList,
  'CreateWallet'
>

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
  </Navigator>
)
export default FirstAccessStackNavigator
