import renderWithTheme from '../../../TestHelper'
import Settings from '../Settings'
import useSettings from '../useSettings'

jest.mock('../useSettings', () => jest.fn())

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
