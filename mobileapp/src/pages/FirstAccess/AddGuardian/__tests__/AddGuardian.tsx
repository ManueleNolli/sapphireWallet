import renderWithTheme from '../../../../TestHelper'
import useAddGuardian from '../useAddGuardian'
import AddGuardian from '../AddGuardian'

jest.mock('../useAddGuardian', () => jest.fn())
jest.mock('../../../../components/QRCodeScanner/QRCodeScanner')

describe('AddGuardian', () => {
  it('renders correctly', () => {
    ;(useAddGuardian as jest.Mock).mockReturnValue({
      valueAddress: '',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      isQRCodeScanning: false,
      setIsQRCodeScanning: jest.fn(),
      QRCodeFinishedScanning: jest.fn(),
      skipGuardian: jest.fn(),
      withGuardian: jest.fn(),
      isLoading: false,
    })

    const tree = renderWithTheme(
      <AddGuardian
        {...({
          route: {},
        } as any)}
      />
    )
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when loading', () => {
    ;(useAddGuardian as jest.Mock).mockReturnValue({
      valueAddress: '',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      isQRCodeScanning: false,
      setIsQRCodeScanning: jest.fn(),
      QRCodeFinishedScanning: jest.fn(),
      skipGuardian: jest.fn(),
      withGuardian: jest.fn(),
      isLoading: true,
    })

    const tree = renderWithTheme(
      <AddGuardian
        {...({
          route: {},
        } as any)}
      />
    )

    expect(tree).toMatchSnapshot()
    expect(tree.getByText('Deploying smart contract wallet...')).toBeTruthy()
  })

  it('renders correctly when scanning', () => {
    ;(useAddGuardian as jest.Mock).mockReturnValue({
      valueAddress: '',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      isQRCodeScanning: true,
      setIsQRCodeScanning: jest.fn(),
      QRCodeFinishedScanning: jest.fn(),
      skipGuardian: jest.fn(),
      withGuardian: jest.fn(),
      isLoading: false,
    })

    const tree = renderWithTheme(
      <AddGuardian
        {...({
          route: {},
        } as any)}
      />
    )

    expect(tree).toMatchSnapshot()
  })
})
