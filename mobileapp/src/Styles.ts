import { Dimensions, StyleSheet } from 'react-native'

const { width, height } = Dimensions.get('window')
const appStyles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerNoFlex: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContain: {
    contentFit: 'contain',
    flex: 1,
  },
})

const vw = width / 100
const vh = height / 100

export { appStyles, vw, vh }
