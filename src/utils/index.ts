import {Platform, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {check, Permission, RESULTS} from 'react-native-permissions';
import React from 'react';
import {ProductType} from '../types';

export const PRIMARY_ACCENT = '#0071ce';
export const SECONDARY_ACCENT = '#041f41';
export const ICONS = {
  Home: {
    focused: 'home',
    blurred: 'home-outline',
  },
  User: {
    focused: 'person',
    blurred: 'person-outline',
  },
  Cart: {
    focused: 'cart',
    blurred: 'cart-outline',
  },
};
export const AppContext = React.createContext<{
  cartItems: ProductType[];
  setCartItems: (items: ProductType[]) => void;
}>({
  setCartItems: () => {},
  cartItems: [],
});

const OS = Platform.OS;
const {height, width, fontScale} = Dimensions.get('screen');
const calcWidth = (percent: number) => (width * percent) / 100;
const calcHeight = (percent: number) => (height * percent) / 100;
const textSize = (size: number) => size * fontScale;

const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(`@keyStore:${key}`, jsonValue);
  } catch (e) {
    return Promise.reject(e);
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(`@keyStore:${key}`);
    if (!value) {
      return value;
    }

    try {
      const parsedValue = JSON.parse(value);
      return parsedValue;
    } catch (e) {
      return value;
    }
  } catch (e) {
    return Promise.reject(e);
  }
};

const checkPermission = (
  permission: Permission,
  requestFunction: (permission: Permission) => void,
  postGrantFunc: () => void,
) => {
  check(permission)
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          requestFunction(permission);
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          postGrantFunc();
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    })
    .catch(error => {
      console.error(error);
    });
};

export {
  calcHeight,
  calcWidth,
  textSize,
  height,
  width,
  OS,
  checkPermission,
  fontScale,
  storeData,
  getData,
};
