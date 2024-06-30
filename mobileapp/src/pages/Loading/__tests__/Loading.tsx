import renderWithTheme from '../../../TestHelper'
import React from 'react'
import Loading from '../Loading'

describe('Loading', () => {
  it('Render correctly without text', () => {
    const tree = renderWithTheme(<Loading />)

    expect(tree).toMatchSnapshot()
  })

  it('Render correctly with text', () => {
    const tree = renderWithTheme(<Loading text="Loading..." />)

    expect(tree).toMatchSnapshot()
  })
})
