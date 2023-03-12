import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import AppButton from '../components/common/AppButton';
import Text from '../components/common/Text';
import {ProductType} from '../types';
import {calcWidth} from '../utils';

const styles = StyleSheet.create({
  img: {
    width: calcWidth(75),
    height: '100%',
    borderWidth: 5,
    borderColor: 'black',
  },
  imgContainer: {
    padding: 8,
    flex: 0.5,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ProductDetailsScreen = () => {
  const {params} = useRoute();
  const navigation = useNavigation();
  const {imageURI, price, name, stock} = (params as {data: ProductType})?.data;

  const onBackPress = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={{uri: imageURI}} style={styles.img} />
      </View>
      <Text>Name : {name}</Text>
      <Text>Price : {price}$</Text>
      <Text>No of Stocks left : {stock}</Text>
      <AppButton title="Back" onPress={onBackPress} />
    </View>
  );
};

export default ProductDetailsScreen;
