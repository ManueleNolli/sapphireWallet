import AsyncStorage from '@react-native-async-storage/async-storage'
import { storeData, getData } from '../index'

jest.mock('@react-native-async-storage/async-storage')

describe('AsyncStorageHelper', () => {
  it('should store data', () => {
    ;(AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(null)
    storeData('key', 'value')
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('key', 'value')
  })

  it('should console error when storing data', async () => {
    ;(AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
      'Error during storing data'
    )
    // spy on console.error
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await storeData('key', 'value')

    // Verify that the error is thrown
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('key', 'value')

    // Verify that the error is logged
    expect(spy).toHaveBeenCalledWith(
      'Error storing data',
      'Error during storing data'
    )
    spy.mockRestore()
  })

  it('should get data', async () => {
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('value')
    const result = await getData('key')
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('key')
    expect(result).toEqual('value')
  })

  it('should get data null', async () => {
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null)
    const result = await getData('key')
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('key')
    expect(result).toEqual(null)
  })

  it('should console error when getting data', async () => {
    ;(AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
      'Error during storing data'
    )
    // spy on console.error
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await getData('key')

    // Verify that the error is thrown
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('key')

    // Verify that the error is logged
    expect(spy).toHaveBeenCalledWith(
      'Error getting data',
      'Error during storing data'
    )
    spy.mockRestore()
  })
})
