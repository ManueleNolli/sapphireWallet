import AsyncStorage from '@react-native-async-storage/async-storage'
export const storeData = (key: string, value: any): void => {
  try {
    AsyncStorage.setItem(key, value)
  } catch (e) {
    // do nothing
  }
}

export const getData = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return value
    }
    return null
  } catch (e) {
    // do nothing
    return null
  }
}
