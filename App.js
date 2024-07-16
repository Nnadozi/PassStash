import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import AddItem from "./screens/AddItem"
import ViewItem from "./screens/ViewItem"
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const Stack = createNativeStackNavigator()
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{gestureEnabled:false}}>
        <Stack.Screen name = "Items" component={Home}/>
        <Stack.Screen name = "Add Item" component={AddItem}/>
        <Stack.Screen name = "View Item" component={ViewItem}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

