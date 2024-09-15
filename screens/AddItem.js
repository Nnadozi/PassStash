import { StyleSheet, TextInput, View, Button, Alert, Text } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const AddItem = () => {
  const navigation = useNavigation();
  const [identifier, setIdentifier] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const { colors } = useTheme();

  async function setItem() {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      let serviceExists = allKeys.find(key => key === `${identifier}_info`);
      if (serviceExists !== undefined) {
        Alert.alert("Error", "This service already exists. Please use a different identifier.");
        return;
      }

      const item = {
        identifier: identifier,
        userName: userName,
        createdAt: new Date().toISOString() 
      };

      await AsyncStorage.setItem(`${identifier}_info`, JSON.stringify(item));
      await SecureStore.setItemAsync(`${identifier}_password`, password);

      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={identifier}
        onChangeText={text => setIdentifier(text)}
        style={[styles.input, { borderColor: colors.card, color: colors.text,
          backgroundColor:colors.card
        }]}
        placeholder='Service (example: Youtube)'
        placeholderTextColor={colors.border}
        maxLength={50}
      />
      <TextInput
        value={userName}
        onChangeText={text => setUserName(text)}
        style={[styles.input, { borderColor: colors.card, color: colors.text,
          backgroundColor:colors.card
        }]}
        placeholder='Username / Email (example: JohnDoe237)'
        placeholderTextColor={colors.border}
        maxLength={50}
      />
      <TextInput
        value={password}
        onChangeText={text => setPassword(text)}
        style={[styles.input, { borderColor: colors.card, color: colors.text,
          backgroundColor:colors.card
        }]}
        placeholder='Password (example: Password123)'
        placeholderTextColor={colors.border}
        maxLength={50}
        secureTextEntry
      />
      <View style={{ marginVertical: "3%" }} />
      {
        identifier.length === 0 || userName.length === 0 || password.length === 0
          ? null
          : <Button title="Create" onPress={setItem} />
      }
      <View style={{ margin: '1%' }}></View>
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default AddItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "10%",
  },
  input: {
    width: '100%',
    paddingVertical: "5%",
    paddingHorizontal: "2%",
    marginVertical: "2%",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
