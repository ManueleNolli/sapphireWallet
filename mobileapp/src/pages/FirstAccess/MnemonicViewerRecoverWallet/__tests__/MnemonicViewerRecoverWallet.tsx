import renderWithTheme from '../../../../TestHelper'
import MnemonicViewerRecoverWallet from '../MnemonicViewerRecoverWallet'
import useMnemonicViewerRecoverWallet from '../useMnemonicViewerRecoverWallet'

jest.mock('../useMnemonicViewerRecoverWallet', () => jest.fn())

describe('MnemonicViewer', () => {
  it('renders correctly', () => {
    const mnemonicMock = [
      'word1',
      'word2',
      'word3',
      'word4',
      'word5',
      'word6',
      'word7',
      'word8',
      'word9',
      'word10',
      'word11',
      'word12',
    ]

    ;(useMnemonicViewerRecoverWallet as jest.Mock).mockReturnValue({
      mnemonic: mnemonicMock,
      copyMnemonicToClipboard: jest.fn(),
      finishFirstAccess: jest.fn(),
      isLoading: false,
    })

    const tree = renderWithTheme(
      <MnemonicViewerRecoverWallet
        {...({
          route: {
            params: {
              mnemonic: mnemonicMock,
            },
          },
        } as any)}
      />
    )
    expect(tree).toMatchSnapshot()
  })
})
