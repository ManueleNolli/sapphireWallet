import { NETWORKS } from '../../constants/Networks'
import { BRIDGE_NETWORKS } from '../../constants/BridgeNetworks'
import { TouchableOpacity, View } from 'react-native'
import { Icon, IconElement, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
import { vh, vw } from '../../Styles'
import { Image, ImageBackground } from 'expo-image'
import { networkLogo } from '../../assets/AssetsRegistry'
import { BlurView } from 'expo-blur'
import React, { useState } from 'react'
import Collapsible from 'react-native-collapsible'

type NFTCardProps = {
  name: string
  tokenId: number
  collectionName: string
  collectionDescription: string
  image: any
  network: NETWORKS | BRIDGE_NETWORKS
  style?: any
}

export function NFTCard({ name, tokenId, collectionName, collectionDescription, image, network, style }: NFTCardProps) {
  const styles = useStyleSheet(themedStyles)
  const [collapsed, setCollapsed] = useState(true)

  const ArrowIcon = (props: any): IconElement => (
    <Icon {...props} name={collapsed ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline'} />
  )
  const NetworkIcon = () => (
    <Image
      contentFit="contain"
      style={{
        width: 36,
        height: 36,
      }}
      source={networkLogo(network)}
    />
  )

  return (
    <View style={[styles.container, { ...style }]} testID={`NFTCard-${tokenId}`}>
      <ImageBackground source={image} style={styles.imageBackground} contentFit="cover">
        <View style={styles.networkContainer}>
          <NetworkIcon />
        </View>
        <TouchableOpacity
          style={styles.blurContainerWrapper}
          testID="CollapsibleButton"
          onPress={() => {
            setCollapsed(!collapsed)
          }}
        >
          <BlurView intensity={50} style={styles.blurContainer} experimentalBlurMethod="dimezisBlurView">
            <View style={{ width: '90%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text category="h4">{name}</Text>
                <Text category="label" style={{ marginRight: 1 * vw }}>{`#${tokenId}`}</Text>
              </View>

              <Collapsible collapsed={collapsed}>
                <View>
                  <Text category="h6">{collectionName}</Text>
                  <Text>{collectionDescription}</Text>
                </View>
              </Collapsible>
            </View>

            <View
              style={{
                height: '100%',
              }}
            >
              <ArrowIcon style={styles.iconStyle} />
            </View>
          </BlurView>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}

const themedStyles = StyleService.create({
  container: {
    overflow: 'hidden',
    borderColor: 'color-primary-400',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    height: 50 * vh,
    backgroundColor: 'red',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  imageBackground: {
    backgroundColor: 'red',
    width: '100%',
    height: '102%',
    top: -2,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  blurContainerWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 2 * vh,
    marginHorizontal: 2 * vw,
  },
  blurContainer: {
    paddingVertical: 1 * vh,
    paddingHorizontal: 2 * vw,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxHeight: 45 * vh,
  },
  iconStyle: {
    height: 32,
    width: 32,
    tintColor: 'text-basic-color',
  },
  networkContainer: {
    marginVertical: 2 * vh,
    alignItems: 'flex-end',
    marginHorizontal: 2 * vw,
  },
})
