import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartScreen from '../screens/CartScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ProductsScreen from '../screens/ProductsScreen';
import UserScreen from '../screens/UserScreen';
import {RootParams} from '../types';
import {AppContext, ICONS, PRIMARY_ACCENT} from '../utils';

const headerStyleOptions = {
  headerStyle: {
    backgroundColor: PRIMARY_ACCENT,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};
const Tab = createBottomTabNavigator<RootParams>();
const ProductStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();

export const AppNavigator = () => {
  const {cartItems} = React.useContext(AppContext);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => (
          <Ionicons
            name={ICONS[route.name][focused ? 'focused' : 'blurred']}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: PRIMARY_ACCENT,
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Home"
        component={ProductNavigator}
        options={{
          ...headerStyleOptions,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          ...headerStyleOptions,
          ...(cartItems?.length ? {tabBarBadge: cartItems.length} : {}),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={headerStyleOptions}
      />
    </Tab.Navigator>
  );
};

const CartNavigator = () => {
  return (
    <CartStack.Navigator
      initialRouteName="CartList"
      screenOptions={{
        headerShown: false,
      }}>
      <CartStack.Screen
        name="CartList"
        component={CartScreen}></CartStack.Screen>
      <CartStack.Screen
        name="Details"
        component={ProductDetailsScreen}></CartStack.Screen>
    </CartStack.Navigator>
  );
};

const ProductNavigator = () => {
  return (
    <ProductStack.Navigator initialRouteName="Products">
      <ProductStack.Screen
        name="Products"
        component={ProductsScreen}
        options={headerStyleOptions}
      />
      <ProductStack.Screen
        name="Details"
        component={ProductDetailsScreen}
        options={{
          ...headerStyleOptions,
          headerBackVisible: true,
        }}
      />
    </ProductStack.Navigator>
  );
};
