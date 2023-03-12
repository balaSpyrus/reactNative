import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import codePush from 'react-native-code-push';
import {ToastProvider} from 'react-native-toast-notifications';
import {AppNavigator} from './src/navigation';
import {ProductType} from './src/types';
import {AppContext, getData, storeData} from './src/utils';

function App(): JSX.Element {
  const backgroundStyle = {
    flex: 1,
  };
  const [cartItems, setItems] = useState<ProductType[]>([]);

  const getCartData = React.useCallback(() => {
    getData('cartData')
      .then(data => setItems(data || []))
      .catch(e => console.error(e));
  }, []);

  const setCartItems = (items: ProductType[]) => {
    storeData('cartData', items ?? []);
    setItems(items ?? []);
  };

  useEffect(() => {
    getCartData();
  }, [getCartData]);

  return (
    <ToastProvider
      placement="bottom"
      duration={1000}
      animationType="slide-in"
      animationDuration={200}
      textStyle={{fontSize: 16}}
      offsetBottom={55}
      swipeEnabled={true}>
      <AppContext.Provider value={{setCartItems, cartItems}}>
        <NavigationContainer>
          <SafeAreaView style={backgroundStyle}>
            <StatusBar />
            <AppNavigator />
          </SafeAreaView>
        </NavigationContainer>
      </AppContext.Provider>
    </ToastProvider>
  );
}
let codePushOptions = {
  // updateDialog: true,
  // installMode: codePush.InstallMode.IMMEDIATE,
};

// export default App;
export default codePush(codePushOptions)(App);
