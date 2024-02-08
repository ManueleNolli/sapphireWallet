import React from 'react'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import renderWithTheme from '../../../TestHelper'
import QRCodeScanner from '../QRCodeScanner'
import useQRCodeScanner from '../useQRCodeScanner'
import { Platform } from 'react-native'

jest.mock('../useQRCodeScanner', () => jest.fn())

describe('QRCodeScanner', () => {
  it('renders correctly not android', () => {
    const onQrCodeScanned = jest.fn()

    ;(useQRCodeScanner as jest.Mock).mockReturnValue({
      scanned: false,
      handleBarCodeScanned: onQrCodeScanned,
    })
    const tree = renderWithTheme(
      <QRCodeScanner onQRCodeScanned={onQrCodeScanned} />
    )

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly android', () => {
    const onQrCodeScanned = jest.fn()
    ;(useQRCodeScanner as jest.Mock).mockReturnValue({
      scanned: false,
      handleBarCodeScanned: onQrCodeScanned,
    })

    Platform.OS = 'android'

    const tree = renderWithTheme(
      <QRCodeScanner onQRCodeScanned={onQrCodeScanned} />
    )

    expect(tree).toMatchSnapshot()
  })
})
