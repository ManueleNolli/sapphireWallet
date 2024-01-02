import { NETWORKS } from '../../constants/Networks'
import { TouchableOpacity, View } from 'react-native'
import {
  Icon,
  IconElement,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components'
import { vh, vw } from '../../Styles'
import { Image, ImageBackground } from 'expo-image'
import { networkLogo } from '../../assets/AssetsRegistry'
import { BlurView } from 'expo-blur'
import React, { useState } from 'react'
import Collapsible from 'react-native-collapsible'

type NFTCardProps = {
  name: string
  tokenId: string
  collectionName: string
  collectionDescription: string
  image: any
  network: NETWORKS
  style?: any
}

export function NFTCard({
  name,
  tokenId,
  collectionName,
  collectionDescription,
  image,
  network,
  style,
}: NFTCardProps) {
  const styles = useStyleSheet(themedStyles)
  const [collapsed, setCollapsed] = useState(true)

  const ArrowIcon = (props: any): IconElement => (
    <Icon
      {...props}
      name={
        collapsed ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline'
      }
    />
  )
  const NetworkIcon = () => (
    <Image
      contentFit={'contain'}
      style={{
        width: 24,
        height: 24,
        marginRight: 8,
      }}
      source={networkLogo(network)}
    />
  )

  return (
    <View style={[styles.container, { ...style }]}>
      <ImageBackground
        source={image}
        contentFit="cover"
        style={styles.imageBackground}
      >
        <TouchableOpacity
          style={styles.blurContainerWrapper}
          testID={'CollapsibleButton'}
          onPress={() => {
            setCollapsed(!collapsed)
          }}
        >
          <BlurView intensity={50} style={styles.blurContainer}>
            <View style={{ width: '90%' }}>
              <Text category="h4">
                {name} #{tokenId}
              </Text>
              <Collapsible collapsed={collapsed}>
                <View>
                  <View style={styles.networkContainer}>
                    <NetworkIcon />
                    <Text category="label">{network}</Text>
                  </View>
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
    width: '100%',
    height: 50 * vh,
    borderRadius: 10,
    borderColor: 'color-primary-400',
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
    flexDirection: 'column-reverse',
  },
  blurContainerWrapper: {
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 1 * vh,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2 * vh,
  },
})
