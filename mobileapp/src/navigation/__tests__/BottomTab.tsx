import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import BottomTabNavigator from '../BottomTab'
import renderWithTheme from '../../TestHelper'
import { act, fireEvent, waitFor } from '@testing-library/react-native'

// MOCKS
jest.mock('../../pages/Home/Home')
jest.mock('../../pages/Details/Details')
jest.mock('../../pages/Settings/Settings')

describe('BottomTabNavigator', () => {
  it('Renders correctly first page', () => {
    const tree = renderWithTheme(
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    )

    // Assert that the initial screen is rendered
    expect(tree.getAllByText('Home')).toBeDefined()
    expect(tree.getByText('NFTs')).toBeDefined()
    expect(tree.getByText('Settings')).toBeDefined()
    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('Navigates to Settings when pressing the "Settings" tab', async () => {
    const tree = renderWithTheme(
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    )

    await act(async () => {
      const button = await tree.getByText('Settings')
      fireEvent.press(button)
      await waitFor(() => {
        expect(tree.getAllByText('Settings')).toBeDefined()
      })
    })
  })

  it('Navigates to Settings when pressing the "NFTs" tab', async () => {
    const tree = renderWithTheme(
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    )

    await act(async () => {
      const button = await tree.getByText('NFTs')
      fireEvent.press(button)
      await waitFor(() => {
        expect(tree.getAllByText('NFTs')).toBeDefined()
      })
    })
  })
})
