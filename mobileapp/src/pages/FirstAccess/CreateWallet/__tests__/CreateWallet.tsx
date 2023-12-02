import renderWithTheme from '../../../../TestHelper'
import CreateWallet from '../CreateWallet'
import { CreateWalletProps } from '../../../../navigation/FirstAccessStack'
import useCreateWallet from '../useCreateWallet'

// MOCKS
jest.mock('../useCreateWallet', () => jest.fn())

const props = {
  navigation: {
    navigate: jest.fn(),
  },
  route: jest.fn(),
} as unknown as CreateWalletProps

describe('CreateWallet', () => {
  beforeEach(() => {
    ;(useCreateWallet as jest.Mock).mockReturnValue({
      createAndNavigate: jest.fn(),
    })
  })

  it('Render correctly', () => {
    const tree = renderWithTheme(<CreateWallet {...props} />)

    expect(tree).toMatchSnapshot()
  })
})
