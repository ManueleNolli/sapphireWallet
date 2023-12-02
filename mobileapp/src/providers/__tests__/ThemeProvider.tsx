import React from 'react'
import { Button, Text } from 'react-native'
import { getData } from '../../services/AsyncStorageHelper'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import renderWithTheme from '../../TestHelper'
import { ThemeProvider } from '../ThemeProvider'
import { ThemeContext } from '../../context/ThemeContext'

// MOCKS
const MockComponent = () => {
  return <Text>Mock</Text>
}

jest.mock('../../pages/Loading/Loading')
jest.mock('../../services/AsyncStorageHelper')
describe('ThemeProvider', () => {
  it('Load Children', async () => {
    ;(getData as jest.Mock).mockReturnValue(Promise.resolve('light'))

    let tree

    await waitFor(async () => {
      tree = renderWithTheme(
        <ThemeProvider>
          <MockComponent />
        </ThemeProvider>
      )
    })

    expect(tree).toMatchSnapshot()
  })

  it('Loading', async () => {
    ;(getData as jest.Mock).mockReturnValue(Promise.resolve('light'))

    await waitFor(() => {
      let tree = renderWithTheme(
        <ThemeProvider>
          <MockComponent />
        </ThemeProvider>
      )
      expect(tree).toMatchSnapshot()
      Promise.resolve()
    })
  })

  it('First Access', async () => {
    ;(getData as jest.Mock).mockReturnValue(Promise.resolve(null))

    const MockTheme = () => {
      const { theme } = React.useContext(ThemeContext)
      return (
        <div>
          <Text>{theme}</Text>
        </div>
      )
    }

    let tree
    await waitFor(() => {
      tree = renderWithTheme(
        <ThemeProvider>
          <MockTheme />
        </ThemeProvider>
      )
    })

    expect(tree!.getByText('light')).toBeTruthy()
  })

  it('Toggle theme', async () => {
    ;(getData as jest.Mock).mockReturnValue(Promise.resolve('dark'))

    const MockComponentToggle = () => {
      const { toggleTheme, theme } = React.useContext(ThemeContext)
      return (
        <div>
          <Text>{theme}</Text>
          <Button onPress={() => toggleTheme()} title={'Toggle'} />
        </div>
      )
    }

    let tree

    await waitFor(async () => {
      tree = renderWithTheme(
        <ThemeProvider>
          <MockComponentToggle />
        </ThemeProvider>
      )
    })
    expect(tree).toMatchSnapshot()
    expect(tree!.getByText('dark')).toBeTruthy()

    await act(async () => {
      const button = tree!.getByRole('button')
      fireEvent.press(button)
    })

    expect(tree).toMatchSnapshot()
    expect(tree!.getByText('light')).toBeTruthy()
  })
})
