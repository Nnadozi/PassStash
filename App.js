import React, { useEffect, useState, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import Home from './screens/Home';
import AddItem from './screens/AddItem';
import ViewItem from './screens/ViewItem';
import { useNavigation, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { TouchableOpacity, useColorScheme, Alert, BackHandler, Platform, Animated } from 'react-native'; 
import { StatusBar } from 'expo-status-bar';
import Entypo from '@expo/vector-icons/Entypo';
import * as LocalAuthentication from 'expo-local-authentication'; 
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createNativeStackNavigator();

function AddItemIcon() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity activeOpacity={0.75}>
      <Entypo
        name="add-to-list" size={27} color={useTheme().colors.text}
        onPress={() => navigation.navigate('Add Item')}
      />
    </TouchableOpacity>
  );
}

export default function App() {
  const [isAppReady, setAppReady] = useState(false); 
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scheme = useColorScheme();

  useEffect(() => {
    prepare();
    checkDeviceAuthentication();
    setNavigationBarColor();
  }, [scheme]);

  const checkDeviceAuthentication = async () => {
    const enrolledLevel = await LocalAuthentication.getEnrolledLevelAsync();
    if (enrolledLevel === LocalAuthentication.SecurityLevel.NONE) {
      Alert.alert(
        'Authentication Required',
        'Please enable device security (PIN, fingerprint, etc.) in your device settings to use this app.',
        [{ text: 'OK', onPress: () => BackHandler.exitApp() }]
      );
    }
  };

  const setNavigationBarColor = () => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(scheme === 'dark' ? '#000000' : '#ffffff');
      NavigationBar.setButtonStyleAsync(scheme === 'dark' ? 'light' : 'dark');
    }
  };

  async function prepare() {
    try {
      await SplashScreen.preventAutoHideAsync();
      setTimeout(async () => {
        setAppReady(true); 
        fadeIn(); 
        await SplashScreen.hideAsync(); 
      },1000);
    } catch (e) {
      console.warn(e);
    }
  }

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1, 
      duration: 250, 
      useNativeDriver: true,
    }).start();
  };

  if (!isAppReady) {
    return null; 
  }

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
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
              headerTitleAlign: "center",
              headerLeft: () => <AddItemIcon/>,
            }}
          />
          <Stack.Screen
            name="Add Item"
            component={AddItem}
            options={{
              headerTitleAlign: "center",
              headerBackVisible: false,
              headerTitle: "Add Account",
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
    </Animated.View>
  );
}
