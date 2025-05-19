// app/(tabs)/_layout.tsx
import React from 'react'
import { View } from 'react-native'
import { Slot } from 'expo-router'
import styles from '../../styles/tabsLayout'
import Navigation from '../../components/Navigation'

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <Navigation />
    </View>
  )
}




