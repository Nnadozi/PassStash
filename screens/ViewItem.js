import { Alert, Button, StyleSheet, Text, TextInput, View, TouchableOpacity, Clipboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { MaterialIcons } from '@expo/vector-icons';

const ViewItem = ({ navigation, route }) => {
  const { key } = route.params;
  const [item, setItem] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  async function getItem() {
    try {
      const theItem = await AsyncStorage.getItem(key);
      if (theItem !== null) {
        const parsedItem = JSON.parse(theItem);
        setItem(parsedItem);
        setNewUserName(parsedItem.userName);

        const savedPassword = await SecureStore.getItemAsync(`${parsedItem.identifier}_password`);
        setPassword(savedPassword);
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
              await SecureStore.deleteItemAsync(`${item.identifier}_password`);
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
      } else {
        Alert.alert('Authentication Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      Alert.alert('Error', 'An error occurred during authentication.');
    }
  }

  async function editItem() {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to edit credentials',
      });

      if (success) {
        setIsAuthenticated(true);
        setIsEditing(true);
      } else {
        Alert.alert('Authentication Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      Alert.alert('Error', 'An error occurred during authentication.');
    }
  }

  async function saveChanges() {
    try {
      const updatedItem = { ...item, userName: newUserName };
      await AsyncStorage.setItem(key, JSON.stringify(updatedItem));

      if (newPassword) {
        await SecureStore.setItemAsync(`${item.identifier}_password`, newPassword);
        setPassword(newPassword); 
      }

      setItem(updatedItem);
      setIsEditing(false);
      setShowPassword(true); 
    } catch (error) {
      console.log(error);
    }
  }

  const copyToClipboard = () => {
    if (password) {
      Clipboard.setString(password);
      setSnackbarVisible(true);
    }
  };

  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      {item ? (
        <View style={styles.con}>
          <Text style={[styles.header, { color: colors.text }]}>Service</Text>
          <Text style={[styles.text, { color: colors.text }]}>{item.identifier}</Text>
          <Text style={[styles.header, { color: colors.text }]}>Username / Email</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, { borderColor: colors.card, color: colors.text, backgroundColor: colors.card }]}
              value={newUserName}
              onChangeText={text => setNewUserName(text)}
              placeholder='Username / Email'
              placeholderTextColor={colors.border}
              maxLength={50}
            />
          ) : (
            <Text style={[styles.text, { color: colors.text }]}>{item.userName}</Text>
          )}
          <View style={styles.passwordHeaderContainer}>
            <Text style={[styles.header, { color: colors.text }]}>Password</Text>
            {showPassword && (
              <TouchableOpacity onPress={copyToClipboard}>
                <MaterialIcons name="content-copy" size={15} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.passwordContainer}>
            <Text style={[styles.text, { color: colors.text }]}>{showPassword ? password : '*******'}</Text>
          </View>
          {!showPassword && !isEditing && (
            <>
              <Button title="Authenticate to Reveal Password" onPress={authenticate} />
              <View style={{ margin: '1%' }}></View>
            </>
          )}
          {!isEditing ? (
            <Button title="Edit Credentials" onPress={editItem} />
          ) : (
            <>
              <TextInput
                style={[styles.input, { borderColor: colors.card, color: colors.text, backgroundColor: colors.card }]}
                value={newPassword}
                onChangeText={text => setNewPassword(text)}
                placeholder='New Password'
                placeholderTextColor={colors.border}
                secureTextEntry
                maxLength={50}
              />
              <Button title="Save Changes" onPress={saveChanges} />
              <View style={{ margin: '1%' }}></View>
              <Button title="Cancel" onPress={() => setIsEditing(false)} />
            </>
          )}
          <View style={{ margin: '1%' }}></View>
          <Button title='Remove Credentials' onPress={removeItem} />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      <View style={{ position: "absolute", bottom: "0%" }}>
        <BannerAd
          unitId={process.env.EXPO_PUBLIC_UNIT_IDTWO}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
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
    marginVertical: "2%",
  },
  input: {
    width: '100%',
    paddingVertical: "2%",
    paddingHorizontal: "3%",
    marginVertical: "2%",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  passwordHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
