import { act, fireEvent } from '@testing-library/react-native'
import { IndexPath } from '@ui-kitten/components'
import useNetworkSelector from '../useNetworkSelector'
import renderWithTheme from '../../../TestHelper'
import NetworkSelector from '../NetworkSelector'

// MOCKS
jest.mock('../useNetworkSelector', () => jest.fn())
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

describe('NetworkSelector', () => {
  const onNetworkSelect = jest.fn()
  beforeEach(() => {
    ;(useNetworkSelector as jest.Mock).mockReturnValue({
      selectedNetwork: new IndexPath(0),
      onNetworkSelect,
    })
  })

  it('Render correctly', () => {
    const tree = renderWithTheme(<NetworkSelector />)

    expect(tree).toMatchSnapshot()
  })

  it('Select a different network', async () => {
    const tree = renderWithTheme(<NetworkSelector />)
    const select = tree.getByTestId('select')

    await act(async () => {
      fireEvent.press(select)
    })
  })
})
