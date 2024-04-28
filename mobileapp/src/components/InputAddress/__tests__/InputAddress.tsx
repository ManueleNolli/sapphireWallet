import React from 'react'
import { act, fireEvent } from '@testing-library/react-native'
import InputAddress from '../InputAddress'
import renderWithTheme from '../../../TestHelper'
import { isAddress } from 'ethers'

// Mocking isAddress from 'ethers'
jest.mock('ethers')

describe('InputAddress Component', () => {
  it('renders correctly', () => {
    const tree = renderWithTheme(
      <InputAddress
        label="To"
        value=""
        setValue={() => {}}
        isValid={false}
        setIsValid={() => {}}
        setIsQRCodeScanning={() => {}}
      />
    )

    expect(tree.getAllByText('To')).toBeTruthy()
    expect(tree.getByPlaceholderText('Address')).toBeTruthy()
    expect(tree).toMatchSnapshot()
  })

  it('updates value and calls setIsValid correctly', async () => {
    ;(isAddress as unknown as jest.Mock).mockReturnValue(true)

    const setIsValidMock = jest.fn()
    const tree = renderWithTheme(
      <InputAddress
        label="to"
        value=""
        setValue={() => {}}
        isValid={false}
        setIsValid={setIsValidMock}
        setIsQRCodeScanning={() => {}}
      />
    )

    await act(async () => {
      fireEvent.changeText(tree.getByTestId('@undefined/input'), 'someAddress')
    })

    expect(isAddress).toHaveBeenCalled()
    expect(setIsValidMock).toHaveBeenCalledWith(true)
  })

  it('displays correct status', () => {
    const { getByTestId } = renderWithTheme(
      <InputAddress
        label=""
        value=""
        setValue={() => {}}
        isValid={false}
        setIsValid={() => {}}
        setIsQRCodeScanning={() => {}}
      />
    )

    expect(getByTestId('@undefined/input').props.status).toBe('basic')
  })

  it('displays success status when isValid is true', () => {
    ;(isAddress as unknown as jest.Mock).mockReturnValue(true)
    const { getByTestId } = renderWithTheme(
      <InputAddress
        label=""
        value="Address"
        setValue={() => {}}
        isValid
        setIsValid={() => {}}
        setIsQRCodeScanning={() => {}}
      />
    )

    expect(getByTestId('@undefined/input').props.status).toBe('success')
  })

  it('displays danger status when isValid is false and value length is greater than 0', () => {
    const { getByTestId } = renderWithTheme(
      <InputAddress
        label=""
        value="invalidAddress"
        setValue={() => {}}
        isValid={false}
        setIsValid={() => {}}
        setIsQRCodeScanning={() => {}}
      />
    )

    // Expecting the status to be 'danger'
    expect(getByTestId('@undefined/input').props.status).toBe('danger')
  })

  it('calls QrCodeIcon onPress correctly', () => {
    const setIsQRCodeScanningMock = jest.fn()
    const { getByTestId } = renderWithTheme(
      <InputAddress
        label=""
        value=""
        setValue={() => {}}
        isValid={false}
        setIsValid={() => {}}
        setIsQRCodeScanning={setIsQRCodeScanningMock}
      />
    )

    // Triggering QrCodeIcon onPress
    fireEvent.press(getByTestId('qr-code-icon'))
    expect(setIsQRCodeScanningMock).toHaveBeenCalledWith(true)
  })
})
