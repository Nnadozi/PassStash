import { StyleSheet, View, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useTheme } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import MyInput from "../components/MyInput";
import PasswordCustomizationModal from "../components/PasswordCustomizationModal"

const AddItem = () => {
  const navigation = useNavigation();
  const [identifier, setIdentifier] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();

  const setItem = async () => {
    if (!/^[a-zA-Z0-9]*$/.test(identifier)) {
      Alert.alert("Error", "Service name must only contain alphanumeric characters (no spaces, special characters, etc)");
      return;
    }
  
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      if (allKeys.includes(`${identifier}_info`)) {
        Alert.alert("Error", "This service already exists. Please use a different identifier.");
        return;
      }
      const item = { identifier, userName, createdAt: new Date().toISOString() };
      await AsyncStorage.setItem(`${identifier}_info`, JSON.stringify(item));
      await SecureStore.setItemAsync(`${identifier}_password`, password);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <View style={styles.container}>
      <MyInput value={identifier} onChangeText={setIdentifier} placeholder="Service Name" maxLength={50} />
      <MyInput value={userName} onChangeText={setUserName} placeholder="Username or Email" maxLength={50} />
      <MyInput value={password} onChangeText={setPassword} placeholder="Password" maxLength={50} />
      <View style={styles.buttonContainer}>
        {identifier && userName && password ? <Button title="Add" onPress={setItem} /> : null}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Generate Password" onPress={() => setModalVisible(true)} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={navigation.goBack} />
      </View>

      <PasswordCustomizationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGenerate={(newPassword) => setPassword(newPassword)}
      />
    </View>
  );
};

export default AddItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: '5%',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: '1%',
  },
});
