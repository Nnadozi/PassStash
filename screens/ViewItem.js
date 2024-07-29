import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import {BannerAd,BannerAdSize, TestIds} from "react-native-google-mobile-ads"
import { useTheme } from '@react-navigation/native';

const ViewItem = ({ navigation, route }) => {
  const { key } = route.params;
  const [item, setItem] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function getItem() {
    try {
      const theItem = await AsyncStorage.getItem(key);
      if (theItem !== null) {
        setItem(JSON.parse(theItem)); 
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getItem();
  }, []); 

  async function removeItem() {
    try {
      Alert.alert(
        "Delete Credentials",
        "Are you sure you want to delete these user credentials?",
        [
          {
            text: 'Yes',
            onPress: async () => {
              await AsyncStorage.removeItem(key);
              navigation.goBack();
            }
          },
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function authenticate() {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to reveal password',
      });

      if (success) {
        setIsAuthenticated(true);
        setShowPassword(true);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  }
    
  const {colors} = useTheme()
  return (
    <View style={{ flex: 1 }}>
      {item ? (
        <View style={styles.con}>
          <Text style={[styles.header,{color:colors.text}]}>Service</Text>
          <Text style={[styles.text,{color:colors.text}]}>{item.identifier}</Text>
          <Text style={[styles.header,{color:colors.text}]}>Username / Email</Text>
          <Text style={[styles.text,{color:colors.text}]}>{item.userName}</Text>
          <Text style={[styles.header,{color:colors.text}]}>Password</Text>
          <Text style={[styles.text,{color:colors.text}]}>
            {showPassword ? item.password : '*******'}
          </Text>
          {!showPassword && (
            <Button title="Authenticate to Reveal Password" onPress={authenticate} />
          )}
          <View style = {{margin:'2%'}}></View>
          <Button title='Remove Credentials' onPress={removeItem} />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      <View style = {{position:"absolute",bottom:"10%",justifyContent:"center",alignItems:"center",width:"100%"}}>
      <BannerAd
       unitId={TestIds.BANNER}
       size={BannerAdSize.LARGE_BANNER}
       requestOptions={{
        requestNonPersonalizedAdsOnly:true,
       }}
       />
      </View>
    </View>
  );
};

export default ViewItem;

const styles = StyleSheet.create({
  con: {
    marginVertical: '5%',
    marginHorizontal: '5%',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    marginVertical:"2%"
  },
});
