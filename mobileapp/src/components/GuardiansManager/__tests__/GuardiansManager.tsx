import renderWithTheme from '../../../TestHelper'
import GuardiansManager from '../GuardiansManager'
import useGuardiansManager from '../useGuardiansManager'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

// MOCKS
jest.mock('../useGuardiansManager', () => jest.fn())
jest.mock('../../InputAddress/InputAddress')
jest.mock('../../QRCodeScanner/QRCodeScanner')
jest.mock('@ui-kitten/components', () => {
  const { View } = require('react-native')
  return {
    ...jest.requireActual('@ui-kitten/components'),
    Spinner: () => <View data-testid="spinner" />,
  }
})

describe('GuardiansManager', () => {
  it('Render correctly', async () => {
    ;(useGuardiansManager as jest.Mock).mockReturnValue({
      guardians: ['guardian1', 'guardian2'],
      iseFetchingLoading: false,
      isSendLoading: false,
      isAdding: false,
      setIsAdding: jest.fn(),
      sendAddGuardian: jest.fn(),
      valueAddress: 'valueAddress',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      isQRCodeScanning: false,
      setIsQRCodeScanning: jest.fn(),
      QRCodeFinishedScanning: jest.fn(),
      closeQRCodeScanner: jest.fn(),
      sendRemoveGuardian: jest.fn(),
      removingGuardians: [],
    })
    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<GuardiansManager />)
    })
    expect(tree).toMatchSnapshot()
  })

  it('Render correctly when fetching', async () => {
    ;(useGuardiansManager as jest.Mock).mockReturnValue({
      guardians: ['guardian1', 'guardian2'],
      iseFetchingLoading: true,
      isSendLoading: false,
      isAdding: false,
      setIsAdding: jest.fn(),
      sendAddGuardian: jest.fn(),
      valueAddress: 'valueAddress',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      isQRCodeScanning: false,
      setIsQRCodeScanning: jest.fn(),
      QRCodeFinishedScanning: jest.fn(),
      closeQRCodeScanner: jest.fn(),
      sendRemoveGuardian: jest.fn(),
      removingGuardians: [],
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<GuardiansManager />)
    })
    expect(tree).toMatchSnapshot()
  })

  it('Render correctly when removing', async () => {
    ;(useGuardiansManager as jest.Mock).mockReturnValue({
      guardians: ['guardian1', 'guardian2'],
      iseFetchingLoading: true,
      isSendLoading: false,
      isAdding: false,
      setIsAdding: jest.fn(),
      sendAddGuardian: jest.fn(),
      valueAddress: 'valueAddress',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      isQRCodeScanning: false,
      setIsQRCodeScanning: jest.fn(),
      QRCodeFinishedScanning: jest.fn(),
      closeQRCodeScanner: jest.fn(),
      sendRemoveGuardian: jest.fn(),
      removingGuardians: ['guardian1'],
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<GuardiansManager />)
    })
    expect(tree).toMatchSnapshot()
  })

  it('Render correctly when is sending', async () => {
    ;(useGuardiansManager as jest.Mock).mockReturnValue({
      guardians: ['guardian1', 'guardian2'],
      iseFetchingLoading: false,
      isSendLoading: true,
      isAdding: false,
      setIsAdding: jest.fn(),
      sendAddGuardian: jest.fn(),
      valueAddress: 'valueAddress',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      isQRCodeScanning: false,
      setIsQRCodeScanning: jest.fn(),
      QRCodeFinishedScanning: jest.fn(),
      closeQRCodeScanner: jest.fn(),
      sendRemoveGuardian: jest.fn(),
      removingGuardians: [],
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<GuardiansManager />)
    })
    expect(tree).toMatchSnapshot()
  })

  it('Render correctly when isAdding true', async () => {
    ;(useGuardiansManager as jest.Mock).mockReturnValue({
      guardians: ['guardian1', 'guardian2'],
      iseFetchingLoading: false,
      isSendLoading: false,
      isAdding: true,
      setIsAdding: jest.fn(),
      sendAddGuardian: jest.fn(),
      valueAddress: 'valueAddress',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      isQRCodeScanning: false,
      setIsQRCodeScanning: jest.fn(),
      QRCodeFinishedScanning: jest.fn(),
      closeQRCodeScanner: jest.fn(),
      sendRemoveGuardian: jest.fn(),
      removingGuardians: [],
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<GuardiansManager />)
    })
    expect(tree).toMatchSnapshot()
  })

  it('Update correctly when pressed Add guardians', async () => {
    ;(useGuardiansManager as jest.Mock).mockReturnValue({
      guardians: ['guardian1', 'guardian2'],
      iseFetchingLoading: false,
      isSendLoading: false,
      isAdding: false,
      setIsAdding: jest.fn(),
      sendAddGuardian: jest.fn(),
      valueAddress: 'valueAddress',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      isQRCodeScanning: false,
      setIsQRCodeScanning: jest.fn(),
      QRCodeFinishedScanning: jest.fn(),
      closeQRCodeScanner: jest.fn(),
      sendRemoveGuardian: jest.fn(),
      removingGuardians: [],
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<GuardiansManager />)
    })
    expect(tree).toMatchSnapshot()

    await act(async () => {
      const button = tree.getByTestId('add-guardian')
      fireEvent.press(button)
    })
    expect(tree).toMatchSnapshot()
  })

  it('Update correctly when pressed Remove guardian', async () => {
    const sendRemoveGuardian = jest.fn()
    ;(useGuardiansManager as jest.Mock).mockReturnValue({
      guardians: ['guardian1', 'guardian2'],
      iseFetchingLoading: false,
      isSendLoading: false,
      isAdding: false,
      setIsAdding: jest.fn(),
      sendAddGuardian: jest.fn(),
      valueAddress: 'valueAddress',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      isQRCodeScanning: false,
      setIsQRCodeScanning: jest.fn(),
      QRCodeFinishedScanning: jest.fn(),
      closeQRCodeScanner: jest.fn(),
      sendRemoveGuardian,
      removingGuardians: [],
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<GuardiansManager />)
    })
    expect(tree).toMatchSnapshot()

    await act(async () => {
      const button = tree.getByTestId('delete-icon-guardian2')
      fireEvent.press(button)
    })

    expect(sendRemoveGuardian).toHaveBeenCalledWith('guardian2')

    expect(tree).toMatchSnapshot()
  })

  it('Render correctly when qrScanning true', async () => {
    ;(useGuardiansManager as jest.Mock).mockReturnValue({
      guardians: ['guardian1', 'guardian2'],
      iseFetchingLoading: false,
      isSendLoading: false,
      isAdding: false,
      setIsAdding: jest.fn(),
      sendAddGuardian: jest.fn(),
      valueAddress: 'valueAddress',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      isQRCodeScanning: true,
      setIsQRCodeScanning: jest.fn(),
      QRCodeFinishedScanning: jest.fn(),
      closeQRCodeScanner: jest.fn(),
      sendRemoveGuardian: jest.fn(),
      removingGuardians: [],
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<GuardiansManager />)
    })
    expect(tree).toMatchSnapshot()
  })
})
