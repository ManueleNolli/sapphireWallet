import React from 'react'
import { Button, Divider, Icon, IconElement, Text } from '@ui-kitten/components'
import SafeAreaView from '../../utils/SafeAreaView'
import { vh } from '../../Styles'
import useSettings from './useSettings'

export default function Settings() {
  const { theme, toggleFirstAccess, toggleThemeWithAnimation, themeIconRef } =
    useSettings()

  const ThemeIcon = (props: any): IconElement => (
    <Icon
      {...props}
      name={theme === 'light' ? 'moon' : 'sun'}
      animation="zoom"
      ref={themeIconRef}
    />
  )

  const DeleteIcon = (props: any): IconElement => (
    <Icon {...props} name="alert-triangle" />
  )

  return (
    <SafeAreaView>
      <Text category="h1" style={{ marginBottom: 2 * vh }}>
        Settings
      </Text>
      <Text category="h6">Customisation</Text>
      <Divider style={{ marginTop: 0.5 * vh, marginBottom: 2 * vh }} />
      <Button
        style={{ width: 10 * vh, height: 10 * vh }}
        onPress={toggleThemeWithAnimation}
        accessoryLeft={ThemeIcon}
      />

      <Text category="h6" style={{ marginTop: 10 * vh }}>
        Dev settings
      </Text>
      <Divider style={{ marginTop: 0.5 * vh, marginBottom: 2 * vh }} />
      <Button
        appearance="outline"
        status="danger"
        accessoryLeft={DeleteIcon}
        onPress={toggleFirstAccess}
      >
        Reset local wallet
      </Button>
    </SafeAreaView>
  )
}
