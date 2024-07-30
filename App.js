import React, { useRef, useEffect} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import AddItem from './screens/AddItem';
import ViewItem from './screens/ViewItem';
import { useNavigation, DarkTheme,DefaultTheme } from '@react-navigation/native';
import { Animated, Button,useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

function AddItemIcon() {
  const navigation = useNavigation();
  return (
    <Button
      onPress={() => navigation.navigate('Add Item')}
      title = "Add"
    />
  );
}


export default function App() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scheme = useColorScheme();

  useEffect(() => {
    const loadResources = async () => {
      Animated.timing(fadeAnim, {
        toValue:1,
        duration:1000,
        useNativeDriver:true,
      }).start();
    };
    loadResources();
  }, []);
  return (
    <>
    <StatusBar />
    <Animated.View style = {{flex:1, opacity:fadeAnim}}>
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
            headerTitleAlign:"center"
          }}
        />
        <Stack.Screen
           name="Add Item" 
           component={AddItem} 
           options={{
            presentation:"modal",  
            headerTitleAlign:"center",
            headerBackVisible:false,
            headerTitle:"Add Account"
          }}
        />
        <Stack.Screen name="View Item" component={ViewItem} options ={{  
          headerTitleAlign:"center",
          headerTitle: 'Account Credentials',
          }} />
      </Stack.Navigator>
    </NavigationContainer>
    </Animated.View>
    </>
  );
}
