import renderWithTheme from '../../../../TestHelper'
import MnemonicViewer from '../MnemonicViewer'
import useMnemonicViewer from '../useMnemonicViewer'

jest.mock('../useMnemonicViewer', () => jest.fn())

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

    ;(useMnemonicViewer as jest.Mock).mockReturnValue({
      mnemonic: mnemonicMock,
      copyMnemonicToClipboard: jest.fn(),
      finishFirstAccess: jest.fn(),
      isLoading: false,
    })

    const tree = renderWithTheme(
      <MnemonicViewer
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
