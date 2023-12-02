import React from 'react'
import renderWithTheme from '../../TestHelper'
import { Text } from 'react-native'
import SafeAreaView from '../SafeAreaView'

describe('SafeAreaView', () => {
  it('Render correctly', () => {
    const tree = renderWithTheme(
      <SafeAreaView>
        <Text>Test</Text>
      </SafeAreaView>
    )
    expect(tree).toMatchSnapshot()
  })
})
