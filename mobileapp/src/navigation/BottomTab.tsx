import React, { useContext, useEffect, useRef } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  IconElement,
  Text,
} from '@ui-kitten/components'
import { Image } from 'expo-image'
import { logo, networkLogo } from '../assets/AssetsRegistry'

// Pages
import Home from '../pages/Home/Home'
import NFTs from '../pages/NFTs/NFTs'
import Settings from '../pages/Settings/Settings'
import { ImageProps } from 'react-native'
import { BlockchainContext } from '../context/BlockchainContext'

const { Navigator, Screen } = createBottomTabNavigator()

const BottomTabBar = ({ navigation, state }: any) => {
  const homeIconRef = useRef<Icon<Partial<ImageProps>>>()
  const NFTsIconRef = useRef<Icon<Partial<ImageProps>>>()
  const settingsIconRef = useRef<Icon<Partial<ImageProps>>>()

  const HomeIcon = (props: any): IconElement => (
    <Icon
      {...props}
      ref={homeIconRef}
      animation="pulse"
      name="person"
      animationConfig={{
        duration: 200,
      }}
    />
  )
  const NFTsIcon = (props: any): IconElement => (
    <Icon
      {...props}
      ref={NFTsIconRef}
      animation="pulse"
      name="image"
      animationConfig={{
        duration: 200,
      }}
    />
  )
  const SettingsIcon = (props: any): IconElement => (
    <Icon
      {...props}
      ref={settingsIconRef}
      animation="pulse"
      name="settings"
      animationConfig={{
        duration: 200,
      }}
    />
  )

  useEffect(() => {
    if (state.index === 0 && homeIconRef.current) {
      homeIconRef.current.startAnimation()
    } else if (state.index === 1 && NFTsIconRef.current) {
      NFTsIconRef.current.startAnimation()
    } else if (state.index === 2 && settingsIconRef.current) {
      settingsIconRef.current.startAnimation()
    }
  }, [state.index])

  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <BottomNavigationTab title="Home" icon={HomeIcon} />
      <BottomNavigationTab title="NFTs" icon={NFTsIcon} />
      <BottomNavigationTab title="Settings" icon={SettingsIcon} />
    </BottomNavigation>
  )
}

const BottomTabNavigator = () => {
  const { currentNetwork } = useContext(BlockchainContext)

  function LogoIcon() {
    return (
      <Image
        contentFit={'contain'}
        style={{
          width: 32,
          height: 32,
          marginLeft: 8,
        }}
        source={logo}
      />
    )
  }

  function NetworkIcon() {
    return (
      <Image
        contentFit={'contain'}
        style={{
          width: 32,
          height: 32,
          marginRight: 8,
        }}
        source={networkLogo(currentNetwork)}
      />
    )
  }

  return (
    <Navigator
      screenOptions={{
        headerTransparent: true,
        headerTitleAlign: 'center',
        headerTitle: (props) => <Text category={'h6'}> {props.children} </Text>,
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Screen
        name="Home"
        component={Home}
        options={({}) => ({
          headerLeft: () => <LogoIcon />,
          headerRight: () => <NetworkIcon />,
        })}
      />
      <Screen name="NFTs" component={NFTs} />
      <Screen name="Settings" component={Settings} />
    </Navigator>
  )
}

export default BottomTabNavigator
