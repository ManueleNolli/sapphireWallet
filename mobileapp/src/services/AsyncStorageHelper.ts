import AsyncStorage from '@react-native-async-storage/async-storage'
export const storeData = async (key: string, value: string): Promise<void> => {
  await AsyncStorage.setItem(key, value).catch((e) => {
    console.error('Error storing data', e)
  })
}

export const getData = async (key: string): Promise<string | null> => {
  const value = await AsyncStorage.getItem(key).catch((e) => {
    console.error('Error getting data', e)
  })
  if (value !== null && value !== undefined) {
    return value
  }
  return null
}
