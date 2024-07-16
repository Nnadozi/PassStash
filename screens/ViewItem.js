import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

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
        "Delete Item",
        "Are you sure you want to delete this item?",
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

  return (
    <View style={{ flex: 1 }}>
      {item ? (
        <View style={styles.con}>
          <Text style={styles.header}>Service</Text>
          <Text style={styles.text}>{item.identifier}</Text>
          <Text style={styles.header}>Username / Email</Text>
          <Text style={styles.text}>{item.userName}</Text>
          <Text style={styles.header}>Password</Text>
          <Text style={styles.text}>
            {showPassword ? item.password : '*******'}
          </Text>
          {!showPassword && (
            <Button title="Authenticate to Reveal Password" onPress={authenticate} />
          )}
          <Button color={"red"} title='Remove Item' onPress={removeItem} />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default ViewItem;

const styles = StyleSheet.create({
  con: {
    marginVertical: '5%',
    marginHorizontal: '5%',
    gap: '10%',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
});
