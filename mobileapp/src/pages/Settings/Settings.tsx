import React from 'react'
import { Button, Divider, Icon, IconElement, Layout, Radio, RadioGroup, Text, useTheme } from '@ui-kitten/components'
import SafeAreaView from '../../utils/SafeAreaView'
import { vh } from '../../Styles'
import useSettings from './useSettings'
import { NETWORKS } from '../../constants/Networks'
import { ScrollView, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import GuardiansManager from '../../components/GuardiansManager/GuardiansManager'
import RecoverableLists from '../../components/RecoverAsAGuardian/RecoverableLists/RecoverableLists'

export default function Settings() {
  const {
    theme,
    resetLocalWallet,
    toggleThemeWithAnimation,
    themeIconRef,
    selectedIndex,
    onNetworkSelect,
    guardiansRefresh,
    setGuardiansRefresh,
    recoverAsGuardianRefresh,
    setRecoverAsGuardianRefresh,
  } = useSettings()
  const kittenTheme = useTheme()

  const ThemeIcon = (props: any): IconElement => (
    <Icon {...props} name={theme === 'light' ? 'moon' : 'sun'} animation="zoom" ref={themeIconRef} />
  )

  const DeleteIcon = (props: any): IconElement => <Icon {...props} name="alert-triangle" />

  const RefreshIcon = (props: any) => {
    return (
      <TouchableOpacity {...props}>
        <Icon name="refresh" style={{ tintColor: kittenTheme['color-primary-600'] }} />
      </TouchableOpacity>
    )
  }

  const networkUppercase = (network: string) => network.charAt(0).toUpperCase() + network.slice(1)

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={{ paddingTop: 5 * vh }}>
          <Text category="h6">Network</Text>
          <Divider style={{ marginTop: 0.5 * vh, marginBottom: 2 * vh }} />
          <RadioGroup selectedIndex={selectedIndex} onChange={onNetworkSelect}>
            {Object.values(NETWORKS).map((network, index) => (
              <Radio key={index}>
                <Text category="s1">{networkUppercase(network)}</Text>
              </Radio>
            ))}
          </RadioGroup>

          <Text category="h6" style={{ marginTop: 5 * vh }}>
            Customisation
          </Text>
          <Divider style={{ marginTop: 0.5 * vh, marginBottom: 2 * vh }} />
          <Button
            style={{ width: 10 * vh, height: 10 * vh }}
            onPress={toggleThemeWithAnimation}
            accessoryLeft={ThemeIcon}
          />

          <View
            style={{ marginTop: 5 * vh, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}
          >
            <Text category="h6">Guardians</Text>
            <RefreshIcon style={{ width: 24, height: 24 }} onPress={setGuardiansRefresh} />
          </View>
          <Divider style={{ marginTop: 0.5 * vh, marginBottom: 2 * vh }} />
          <GuardiansManager refreshRequest={guardiansRefresh} />

          <View
            style={{ marginTop: 5 * vh, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}
          >
            <Text category="h6">Recover as a guardian</Text>
            <RefreshIcon style={{ width: 24, height: 24 }} onPress={setRecoverAsGuardianRefresh} />
          </View>
          <Divider style={{ marginTop: 0.5 * vh, marginBottom: 2 * vh }} />
          <RecoverableLists refreshRequest={recoverAsGuardianRefresh} />

          <Text category="h6" style={{ marginTop: 5 * vh }}>
            Dev settings
          </Text>
          <Divider style={{ marginTop: 0.5 * vh, marginBottom: 2 * vh }} />
          <Button appearance="outline" status="danger" accessoryLeft={DeleteIcon} onPress={resetLocalWallet}>
            Reset local wallet
          </Button>
        </SafeAreaView>
      </ScrollView>
    </Layout>
  )
}
