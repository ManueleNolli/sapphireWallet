import React from 'react'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import renderWithTheme from '../../TestHelper'
import { BlockchainProvider } from '../BlockchainProvider'
import { getProvider } from '../../services/blockchain'
import { Text } from 'react-native'
import { BlockchainContext } from '../../context/BlockchainContext'
import { Provider } from 'ethers'
import { NETWORKS } from '../../constants/Networks'

jest.mock('../../pages/Loading/Loading')
jest.mock('../../pages/Error/Error')
jest.mock('../../services/blockchain')

function MockComponent() {
  const { currentNetwork } = React.useContext(BlockchainContext)
  return (
    <div>
      <Text>{currentNetwork}</Text>
    </div>
  )
}

describe('BlockchainProvider', () => {
  it('should set default start up network', async () => {
    ;(getProvider as jest.Mock).mockResolvedValue({} as Provider)
    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(
        <BlockchainProvider>
          <MockComponent />
        </BlockchainProvider>
      )
    })

    expect(tree.getByText(NETWORKS.SEPOLIA)).toBeTruthy()
  })

  it('should catch error at start up', async () => {
    ;(getProvider as jest.Mock).mockRejectedValue('error')
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(
        <BlockchainProvider>
          <MockComponent />
        </BlockchainProvider>
      )
    })

    expect(spy).toHaveBeenCalledWith('Error connecting to blockchain')
    expect(tree).toMatchSnapshot()
  })

  it('render loading', async () => {
    ;(getProvider as jest.Mock).mockReturnValue(Promise.resolve())
    const tree = renderWithTheme(
      <BlockchainProvider>
        <MockComponent />
      </BlockchainProvider>
    )

    expect(tree).toMatchSnapshot()

    // Wait for loading
    await waitFor(() => {
      Promise.resolve()
    })
  })
})
