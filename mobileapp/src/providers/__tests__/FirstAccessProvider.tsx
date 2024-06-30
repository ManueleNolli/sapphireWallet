import React from 'react'
import { Text, Button } from 'react-native'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import { FirstAccessProvider } from '../FirstAccessProvider'
import { getData } from '../../services/storage/'
import { FirstAccessContext } from '../../context/FirstAccessContext'
import renderWithTheme from '../../TestHelper'

// MOCKS
const MockComponent = () => {
  return <Text>Mock</Text>
}

jest.mock('../../pages/Loading/Loading')
jest.mock('../../navigation/FirstAccessStack')
jest.mock('../../services/storage/')

describe('FirstAccessProvider', () => {
  it('Load First Access Stack', async () => {
    ;(getData as jest.Mock).mockReturnValue(Promise.resolve('true')) // firstAccess === true

    let tree

    await waitFor(async () => {
      tree = renderWithTheme(
        <FirstAccessProvider>
          <MockComponent />
        </FirstAccessProvider>
      )
    })

    expect(tree).toMatchSnapshot()
  })

  it('Load Children', async () => {
    ;(getData as jest.Mock).mockReturnValue(Promise.resolve(false))

    let tree

    await waitFor(async () => {
      tree = renderWithTheme(
        <FirstAccessProvider>
          <MockComponent />
        </FirstAccessProvider>
      )
    })

    expect(tree).toMatchSnapshot()
  })

  it('Toggle first access value', async () => {
    ;(getData as jest.Mock).mockReturnValue(Promise.resolve(false))

    const MockComponentToggle = () => {
      const { toggleFirstAccess } = React.useContext(FirstAccessContext)
      return <Button onPress={() => toggleFirstAccess()} title={'Toggle'} />
    }

    let tree

    await waitFor(async () => {
      tree = renderWithTheme(
        <FirstAccessProvider>
          <MockComponentToggle />
        </FirstAccessProvider>
      )
    })
    expect(tree).toMatchSnapshot()

    await act(async () => {
      const button = tree!.getByRole('button')
      fireEvent.press(button)
    })

    expect(tree).toMatchSnapshot()
  })

  it('Loading', async () => {
    ;(getData as jest.Mock).mockReturnValue(Promise.resolve(false))
    let tree = renderWithTheme(
      <FirstAccessProvider>
        <MockComponent />
      </FirstAccessProvider>
    )

    expect(tree).toMatchSnapshot()

    // Wait for loading
    await waitFor(() => {
      Promise.resolve()
    })
  })
})
