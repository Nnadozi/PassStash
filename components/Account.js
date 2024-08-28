import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native'

const Account = ({children, buttonPress}) => {
    const { colors } = useTheme()
  return (
    <View style = {[styles.con, {borderColor:colors.border,backgroundColor:colors.card}]}>
      <Text style = {[styles.myText,{color:colors.text}]}>{children}</Text>
      <Button title="Open" onPress={buttonPress} />
    </View>
  )
}

export default Account

const styles = StyleSheet.create({
    myText:{
        maxWidth:"80%",
    },
    con:{
        borderTopWidth: 1,
        width: '100%',
        paddingVertical: '3%',
        paddingHorizontal: "5%",
        marginHorizontal: '3%',
        alignSelf: 'center',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    }
})

/**
 *        <View style={[
            styles.item, index === itemsArray.length - 1 && styles.lastItem,
            {borderColor:colors.border,backgroundColor:colors.card}
            ]}>
            <Text style = {{maxWidth:"80%",color:colors.text}}>{item.substring(0,item.indexOf("_"))}</Text>
            <Button title="Open" onPress={() => navigation.navigate("View Item", { key: item })} />
          </View>
 */