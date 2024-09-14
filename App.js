import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import Home from './screens/Home';
import AddItem from './screens/AddItem';
import ViewItem from './screens/ViewItem';
import { useNavigation, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Button, TouchableOpacity, useColorScheme, Alert, BackHandler } from 'react-native'; 
import { StatusBar } from 'expo-status-bar';
import Entypo from '@expo/vector-icons/Entypo';
import * as LocalAuthentication from 'expo-local-authentication'; 

const Stack = createNativeStackNavigator();

function AddItemIcon() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity>
      <Entypo
        name="add-to-list" size={27} color={useTheme().colors.text}
        onPress={() => navigation.navigate('Add Item')}
      />
    </TouchableOpacity>
  );
}

export default function App() {
  const scheme = useColorScheme();

  useEffect(() => {
    checkDeviceAuthentication();
  }, []);

  const checkDeviceAuthentication = async () => {
    const enrolledLevel = await LocalAuthentication.getEnrolledLevelAsync();
    if (enrolledLevel === LocalAuthentication.SecurityLevel.NONE) {
      Alert.alert(
        'Authentication Required',
        'Please enable device security (PIN, fingerprint, etc.) in your device settings to use this app.',
        [
          { text: 'OK', onPress: () => BackHandler.exitApp() } 
        ]
      );
    }
  };

  return (
    <>
      <StatusBar />
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator
          screenOptions={{
            gestureEnabled: false,
          }}
        >
          <Stack.Screen
            name="Items"
            component={Home}
            options={{
              headerTitle: 'My Accounts',
              headerLeft: () => <AddItemIcon />,
              headerTitleAlign: "center"
            }}
          />
          <Stack.Screen
            name="Add Item"
            component={AddItem}
            options={{
              presentation: "containedModal",
              headerTitleAlign: "center",
              headerBackVisible: false,
              headerTitle: "Add Account"
            }}
          />
          <Stack.Screen
            name="View Item"
            component={ViewItem}
            options={{
              headerTitleAlign: "center",
              headerTitle: 'Account Credentials',
              headerBackTitle: "Back"
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
