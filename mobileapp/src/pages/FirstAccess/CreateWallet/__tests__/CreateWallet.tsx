import renderWithTheme from '../../../../TestHelper'
import CreateWallet from '../CreateWallet'
import { CreateWalletProps } from '../../../../navigation/FirstAccessStack'
import useCreateWallet from '../useCreateWallet'
import { act, fireEvent } from '@testing-library/react-native'
import { IndexPath } from '@ui-kitten/components'

// MOCKS
jest.mock('../useCreateWallet', () => jest.fn())
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')

  RN.UIManager.measureInWindow = (name) => {
    return {}
  }

  Object.defineProperty(RN, 'findNodeHandle', {
    get: jest.fn(() => () => 1),
    set: jest.fn(),
  })

  return RN
})
const props = {
  navigation: {
    navigate: jest.fn(),
  },
} as unknown as CreateWalletProps

describe('CreateWallet', () => {
  beforeEach(() => {
    ;(useCreateWallet as jest.Mock).mockReturnValue({
      createAndNavigate: jest.fn(),
      selectedNetwork: new IndexPath(0),
      onNetworkSelect: jest.fn(),
    })
  })

  it('Render correctly', () => {
    const tree = renderWithTheme(<CreateWallet {...props} />)

    expect(tree).toMatchSnapshot()
  })

  it('Select a different network', async () => {
    const tree = renderWithTheme(<CreateWallet {...props} />)
    const select = tree.getByTestId('select')

    await act(async () => {
      fireEvent.press(select)
    })
  })
})
