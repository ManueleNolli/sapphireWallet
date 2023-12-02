import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import FirstAccessStackNavigator from '../FirstAccessStack'
import renderWithTheme from '../../TestHelper'

// MOCKS

jest.mock('../../pages/FirstAccess/CreateWallet/CreateWallet')
jest.mock('../../pages/FirstAccess/MnemonicViewer/MnemonicViewer')

describe('FirstAccessStackNavigator', () => {
  it('Navigates between CreateWallet and MnemonicViewer screens', async () => {
    const tree = renderWithTheme(
      <NavigationContainer>
        <FirstAccessStackNavigator />
      </NavigationContainer>
    )

    expect(tree).toMatchSnapshot()
  })
})
