import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View, TouchableOpacity, Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '@react-navigation/native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { MaterialIcons } from '@expo/vector-icons';
import MyText from '../components/MyText';
import MyInput from '../components/MyInput';

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
  const { colors } = useTheme();

  useEffect(() => {
    const getItem = async () => {
      try {
        const theItem = await AsyncStorage.getItem(key);
        if (theItem) {
          const parsedItem = JSON.parse(theItem);
          setItem(parsedItem);
          setNewUserName(parsedItem.userName);

          const savedPassword = await SecureStore.getItemAsync(`${parsedItem.identifier}_password`);
          setPassword(savedPassword);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getItem();
  }, [key]);

  const removeItem = async () => {
    try {
      Alert.alert(
        'Delete Credentials',
        'Are you sure you want to delete these service credentials?',
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
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const authenticate = async () => {
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
  };

  const editItem = async () => {
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
  };

  const saveChanges = async () => {
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
  };

  const copyToClipboard = () => {
    if (password) {
      Clipboard.setString(password);
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {item ? (
        <View style={styles.container}>
          <MyText fontSize={16} bold={true}>Service</MyText>
          <MyText fontSize={16} style={styles.textMargin}>{item.identifier}</MyText>
          <MyText fontSize={16} bold={true}>Username / Email</MyText>
          {isEditing ? (
            <MyInput
              value={newUserName}
              onChangeText={setNewUserName}
              placeholder="Username / Email"
              maxLength={50}
              thin={true}
            />
          ) : (
            <MyText fontSize={16} style={styles.textMargin}>{item.userName}</MyText>
          )}
          <View style={styles.passwordHeaderContainer}>
            <MyText fontSize={16} bold={true}>Password</MyText>
            {showPassword && (
              <TouchableOpacity style={styles.iconContainer} onPress={copyToClipboard}>
                <MaterialIcons name="content-copy" size={15} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
          {isEditing ? (
            <MyInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              secureTextEntry={true}
              maxLength={50}
              thin={true}
            />
          ) : (
            <MyText fontSize={16} style={styles.textMargin}>{showPassword ? password : '*******'}</MyText>
          )}
          {!showPassword && !isEditing && (
            <>
              <Button title="Authenticate to Reveal Password" onPress={authenticate} />
              <View style={styles.spacing} />
            </>
          )}
          {!isEditing ? (
            <Button title="Edit Credentials" onPress={editItem} />
          ) : (
            <>
              <Button title="Save Changes" onPress={saveChanges} />
              <View style={styles.spacing} />
              <Button title="Cancel" onPress={() => setIsEditing(false)} />
            </>
          )}
          <View style={styles.spacing} />
          <Button title="Remove Credentials" onPress={removeItem} />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      <View style={styles.adContainer}>
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
  container: {
    marginVertical: '5%',
    marginHorizontal: '5%',
  },
  textMargin: {
    marginVertical: '3%',
  },
  passwordHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginHorizontal: '2%',
  },
  spacing: {
    margin: '1%',
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
