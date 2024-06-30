import renderWithTheme from '../../../TestHelper'
import Settings from '../Settings'
import useSettings from '../useSettings'

jest.mock('../useSettings', () => jest.fn())
jest.mock('../../../components/GuardiansManager/GuardiansManager')
jest.mock('../../../components/RecoverAsAGuardian/RecoverableLists/RecoverableLists')

describe('Settings', () => {
  beforeEach(() => {
    ;(useSettings as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleFirstAccess: jest.fn(),
      toggleThemeWithAnimation: jest.fn(),
      themeIconRef: { current: { startAnimation: jest.fn() } },
    })
  })

  it('renders correctly', () => {
    const { toJSON } = renderWithTheme(<Settings />)
    expect(toJSON()).toMatchSnapshot()
  })
})
