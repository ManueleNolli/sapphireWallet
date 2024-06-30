import React from 'react'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import InputNumeric from '../InputNumeric'
import renderWithTheme from '../../../TestHelper'

describe('InputNumeric Component', () => {
  it('renders correctly', () => {
    const tree = renderWithTheme(
      <InputNumeric
        value=""
        setValue={() => {}}
        isValid={false}
        setIsValid={() => {}}
      />
    )

    expect(tree.getAllByText('Amount')).toBeTruthy()
    expect(tree.getByPlaceholderText('0')).toBeTruthy()
    expect(tree).toMatchSnapshot()
  })

  it('updates value and calls setIsValid correctly', async () => {
    const setIsValidMock = jest.fn()

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(
        <InputNumeric
          value=""
          setValue={() => {}}
          isValid={false}
          setIsValid={setIsValidMock}
        />
      )
    })

    await act(async () => {
      const button = tree!.getAllByText('Amount')
      fireEvent.changeText(button[0], '42')
    })

    expect(setIsValidMock).toHaveBeenCalled()
  })

  it('displays correct status', () => {
    const { getByTestId } = renderWithTheme(
      <InputNumeric
        value=""
        setValue={() => {}}
        isValid={false}
        setIsValid={() => {}}
      />
    )

    expect(getByTestId('@input-numeric/input').props.status).toBe('basic')
  })

  it('displays success status when isValid is true', () => {
    const { getByTestId } = renderWithTheme(
      <InputNumeric
        value=""
        setValue={() => {}}
        isValid={true}
        setIsValid={() => {}}
      />
    )

    expect(getByTestId('@input-numeric/input').props.status).toBe('success')
  })

  it('displays danger status when isValid is false and value length is greater than 0', () => {
    const { getByTestId } = renderWithTheme(
      <InputNumeric
        value="invalidValue"
        setValue={() => {}}
        isValid={false}
        setIsValid={() => {}}
      />
    )

    expect(getByTestId('@input-numeric/input').props.status).toBe('danger')
  })

  it('calls renderMaxValueButton onPress correctly', () => {
    const setValueMock = jest.fn()
    const { getByTestId } = renderWithTheme(
      <InputNumeric
        value=""
        setValue={setValueMock}
        isValid={false}
        setIsValid={() => {}}
        maxValue={100}
      />
    )

    fireEvent.press(getByTestId('max-value-button'))

    expect(setValueMock).toHaveBeenCalledWith('100')
  })
})
