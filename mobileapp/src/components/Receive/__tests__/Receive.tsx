import renderWithTheme from '../../../TestHelper'
import { Receive } from '../Receive'
import { act, fireEvent } from '@testing-library/react-native'
import { Share } from 'react-native'

// Mocking Share.share
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')
  RN.Share = {
    share: jest.fn(),
  }
  return RN
})

describe('Receive', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <Receive address={'0x1234567890123456789012345678901234567890'} />
    )
    expect(tree).toMatchSnapshot()
  })

  it('should open the share modal', async () => {
    const shareSpy = jest.spyOn(Share, 'share')

    const tree = renderWithTheme(
      <Receive address={'0x1234567890123456789012345678901234567890'} />
    )
    const shareButton = tree.getByTestId('share-button')

    await act(() => {
      fireEvent.press(shareButton)
    })

    expect(shareSpy).toHaveBeenCalled()
  })
})
