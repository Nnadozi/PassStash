import { Button, FlatList, Platform, StyleSheet, Text,View } from 'react-native';
import React, { useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {BannerAd,BannerAdSize} from "react-native-google-mobile-ads"
import {useTheme} from '@react-navigation/native';

const Home = ({ navigation }) => {

  const {colors} = useTheme()
  const [itemsArray, setItemsArray] = useState([]);

  const fetchItems = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      setItemsArray(keys);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [])
  );

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {
        itemsArray.length === 0 
        ? 
        <>
        <View style = {{position:"absolute",top:"45%"}}>
          <Text style = {[styles.emptyText,{color:colors.text}]}>You have no accounts.</Text>
          <Text style =  {[styles.emptyText,{color:colors.text}]}>Press "Add" to get started.</Text>
        </View>
        </>
        :
        <FlatList
        style={{ width: "100%" }}
        data={itemsArray}
        renderItem={({ item, index }) =>
          <View style={[
            styles.item, index === itemsArray.length - 1 && styles.lastItem,
            {borderColor:colors.border,backgroundColor:colors.card}
            ]}>
            <Text style = {{maxWidth:"80%",color:colors.text}}>{item.substring(0,item.indexOf("_"))}</Text>
            <Button title="→" onPress={() => navigation.navigate("View Item", { key: item })} />
          </View>
        }
        keyExtractor={(item, index) => index.toString()}
      />
      }
      <View style = {{position:"absolute", bottom:"0%"}}>
        <BannerAd
        unitId={process.env.EXPO_PUBLIC_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly:true,
        }}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  item: {
    borderTopWidth: 1,
    width: '100%',
    paddingVertical: '3%',
    paddingHorizontal: "5%",
    marginHorizontal: '3%',
    alignSelf: 'center',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastItem: {
    borderTopWidth: 1,
    borderBottomWidth:1
  },
  emptyText:{
    opacity:0.25,
    textAlign:"center"
  }
});
