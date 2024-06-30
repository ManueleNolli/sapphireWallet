import renderWithTheme from '../../../TestHelper'
import React from 'react'
import Error from '../Error'

describe('Error', () => {
  it('Render correctly without text', () => {
    const tree = renderWithTheme(<Error />)

    expect(tree).toMatchSnapshot()
  })

  it('Render correctly with text', () => {
    const tree = renderWithTheme(<Error text="Error!" />)

    expect(tree).toMatchSnapshot()
  })
})
