import React from 'react'
import { WalletProvider } from '../WalletProvider'
import { Button, Text } from 'react-native'
import { WalletContext } from '../../context/WalletContext'
import renderWithTheme from '../../TestHelper'
import * as SecureStore from 'expo-secure-store'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import { getData, removeData, storeData } from '../../services/storage/'
import constants from '../../constants/Constants'

// MOCKS
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}))

jest.mock('../../services/storage', () => ({
  getData: jest.fn(),
  storeData: jest.fn(),
  removeData: jest.fn(),
}))

const MockComponent = () => {
  const {
    setPrivateKey,
    getPrivateKey,
    getEOAAddress,
    setEOAAddress,
    setWalletContractAddress,
    getWalletContractAddress,
    resetWallet
  } = React.useContext(WalletContext)
  const [privateKey, setPrivateKeyState] = React.useState<string>('')
  const [EOAAddress, setEOAAddressState] = React.useState<string>('')
  const [walletContractAddress, setWalletContractAddressState] =
    React.useState<string>('')

  const getPrivateKeyMock = async () => {
    try {
      const privateKey = await getPrivateKey('message')
      setPrivateKeyState(privateKey)
    } catch (e: any) {
      setPrivateKeyState(e.message)
    }
  }

  const getEOAAddressMock = () => {
    try {
      const EOAAddress = getEOAAddress()
      setEOAAddressState(EOAAddress)
    } catch (e: any) {
      setEOAAddressState(e.message)
    }
  }

  const setEOAAddressMock = async (value: string) => {
    await setEOAAddress(value)
    setEOAAddressState(value)
  }

  const getWalletContractAddressMock = () => {
    try {
      const walletContractAddress = getWalletContractAddress()
      setWalletContractAddressState(walletContractAddress)
    } catch (e: any) {
      setWalletContractAddressState(e.message)
    }
  }

  const setWalletContractAddressMock = async (value: string) => {
    await setWalletContractAddress(value)
    setWalletContractAddressState(value)
  }

  return (
    <div>
      <Button
        onPress={() => setPrivateKey('privateKey')}
        title={'Set private key'}
      />
      <Button onPress={() => getPrivateKeyMock()} title={'Get private key'} />
      <Text>{privateKey}</Text>
      <Button
        title={'Set EOAAddress'}
        onPress={() => setEOAAddressMock('EOAAddress')}
      />
      <Button onPress={() => getEOAAddressMock()} title={'Get EOAAddress'} />

      <Text>{EOAAddress}</Text>

      <Button
        title={'Set WalletContractAddress'}
        onPress={() => setWalletContractAddressMock('WalletContractAddress')}
      />
      <Button
        onPress={() => getWalletContractAddressMock()}
        title={'Get WalletContractAddress'}
      />
      <Text>{walletContractAddress}</Text>

      <Button
        onPress={() => resetWallet()}
        title={'Reset Wallet'}
      />
    </div>
  )
}

describe('WalletProvider', () => {
  describe('Private key', () => {
    beforeEach(() => {
      // Mock AsyncStorageHelper
      ;(getData as jest.Mock).mockReturnValue(Promise.resolve('value'))
      ;(storeData as jest.Mock).mockReturnValue(Promise.resolve())
    })

    it('Set private key', async () => {
      ;(SecureStore.setItemAsync as jest.Mock).mockReturnValue(
        Promise.resolve()
      )

      let tree: any

      await waitFor(async () => {
        tree = renderWithTheme(
          <WalletProvider>
            <MockComponent />
          </WalletProvider>
        )
      })

      await act(async () => {
        const button = tree.getByText('Set private key')
        fireEvent.press(button)
      })

      expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(1)
    })

    it('Get existent private key', async () => {
      ;(SecureStore.getItemAsync as jest.Mock).mockReturnValue(
        Promise.resolve('privateKey')
      )

      let tree: any

      await waitFor(async () => {
        tree = renderWithTheme(
          <WalletProvider>
            <MockComponent />
          </WalletProvider>
        )
      })

      await act(async () => {
        const button = tree.getByText('Get private key')
        fireEvent.press(button)
      })

      expect(SecureStore.getItemAsync).toHaveBeenCalledTimes(1)
      expect(tree.getByText('privateKey')).toBeTruthy()
    })

    it('Get non existent private key', async () => {
      ;(SecureStore.getItemAsync as jest.Mock).mockReturnValue(
        Promise.resolve(null)
      )

      let tree: any

      await waitFor(async () => {
        tree = renderWithTheme(
          <WalletProvider>
            <MockComponent />
          </WalletProvider>
        )
      })

      await act(async () => {
        const button = tree.getByText('Get private key')
        fireEvent.press(button)
      })

      expect(tree.getByText('Private key not found')).toBeTruthy()
    })
  })

  describe('EOAAddress', () => {
    it('Set EOAAddress', async () => {
      ;(getData as jest.Mock).mockReturnValue(Promise.resolve('EOAAddress'))
      ;(storeData as jest.Mock).mockReturnValue(Promise.resolve())

      let tree: any

      await waitFor(async () => {
        tree = renderWithTheme(
          <WalletProvider>
            <MockComponent />
          </WalletProvider>
        )
      })

      await act(async () => {
        const button = tree.getByText('Set EOAAddress')
        fireEvent.press(button)
      })

      expect(storeData).toHaveBeenCalledTimes(1)
    })

    it('Get EOAAddress', async () => {
      ;(getData as jest.Mock).mockReturnValue(Promise.resolve('EOAAddress'))
      ;(storeData as jest.Mock).mockReturnValue(Promise.resolve())

      let tree: any

      await waitFor(async () => {
        tree = renderWithTheme(
          <WalletProvider>
            <MockComponent />
          </WalletProvider>
        )
      })

      await act(async () => {
        const buttonSet = tree.getByText('Set EOAAddress')
        fireEvent.press(buttonSet)

        const buttonGet = tree.getByText('Get EOAAddress')
        fireEvent.press(buttonGet)
      })

      expect(tree.getByText('EOAAddress')).toBeTruthy()
      expect(storeData).toHaveBeenCalled()
    })

    it('Get EOAAddress error', async () => {
      ;(getData as jest.Mock).mockReturnValue(Promise.resolve(null))
      ;(storeData as jest.Mock).mockReturnValue(Promise.resolve())

      let tree: any

      await waitFor(async () => {
        tree = renderWithTheme(
          <WalletProvider>
            <MockComponent />
          </WalletProvider>
        )
      })

      await act(async () => {
        const buttonGet = tree.getByText('Get EOAAddress')
        fireEvent.press(buttonGet)
      })

      expect(tree.getByText('EOA Address not found')).toBeTruthy()
    })
  })

  describe('WalletContractAddress', () => {
    it('Set WalletContractAddress', async () => {
      ;(getData as jest.Mock).mockReturnValue(
        Promise.resolve('WalletContractAddress')
      )
      ;(storeData as jest.Mock).mockReturnValue(Promise.resolve())

      let tree: any

      await waitFor(async () => {
        tree = renderWithTheme(
          <WalletProvider>
            <MockComponent />
          </WalletProvider>
        )
      })

      await act(async () => {
        const button = tree.getByText('Set WalletContractAddress')
        fireEvent.press(button)
      })

      expect(storeData).toHaveBeenCalledWith(
        constants.asyncStoreKeys.walletContractAddress,
        'WalletContractAddress'
      )
    })

    it('Get WalletContractAddress', async () => {
      ;(getData as jest.Mock).mockReturnValue(
        Promise.resolve('WalletContractAddress')
      )
      ;(storeData as jest.Mock).mockReturnValue(Promise.resolve())

      let tree: any

      await waitFor(async () => {
        tree = renderWithTheme(
          <WalletProvider>
            <MockComponent />
          </WalletProvider>
        )
      })

      await act(async () => {
        const buttonSet = tree.getByText('Set WalletContractAddress')
        fireEvent.press(buttonSet)

        const buttonGet = tree.getByText('Get WalletContractAddress')
        fireEvent.press(buttonGet)
      })

      expect(tree.getByText('WalletContractAddress')).toBeTruthy()
      expect(storeData).toHaveBeenCalled()
    })

    it('Get WalletContractAddress error', async () => {
      ;(getData as jest.Mock).mockReturnValue(Promise.resolve(null))
      ;(storeData as jest.Mock).mockReturnValue(Promise.resolve())

      let tree: any

      await waitFor(async () => {
        tree = renderWithTheme(
          <WalletProvider>
            <MockComponent />
          </WalletProvider>
        )
      })

      await act(async () => {
        const buttonGet = tree.getByText('Get WalletContractAddress')
        fireEvent.press(buttonGet)
      })

      expect(tree.getByText('Wallet Contract Address not found')).toBeTruthy()
    })
  })

  describe('Reset wallet', () => {
    it('Reset wallet', async () => {
      let tree: any

      await waitFor(async () => {
        tree = renderWithTheme(
          <WalletProvider>
            <MockComponent />
          </WalletProvider>
        )
      })

      await act(async () => {
        const button = tree.getByText('Reset Wallet')
        fireEvent.press(button)
      })

      expect(removeData).toHaveBeenCalledTimes(2)
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(1)
    })
  })
})
