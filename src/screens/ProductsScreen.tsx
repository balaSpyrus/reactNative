import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import PushNotification from 'react-native-push-notification';
import ProductList from '../containers/ProductList';
import {SECONDARY_ACCENT} from '../utils';

const styles = StyleSheet.create({
  container: {flex: 1},
});

const ProductsScreen = () => {
  const onPress = () =>
    PushNotification.createChannel(
      {channelId: 'test1', channelName: 'test'},
      PushNotification.localNotification({
        channelId: 'test1',
        title: 'test',
        message: 'hello',
      }),
    );

  return (
    <View style={styles.container}>
      <Button
        title="Test Notification"
        onPress={onPress}
        color={SECONDARY_ACCENT}
      />
      <ProductList />
    </View>
  );
};

export default ProductsScreen;
