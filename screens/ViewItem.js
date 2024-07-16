import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ViewItem = ({route}) => {
  const {key} = route.params
  return (
    <View style = {{flex:1,justifyContent:"center",alignItems:"center"}}>
      <Text>Key: {key}</Text>
    </View>
  )
}

export default ViewItem

const styles = StyleSheet.create({})