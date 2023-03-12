import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';
import {ProductType} from '../types';
import {AppContext, calcHeight, calcWidth} from '../utils';
import AppButton from './common/AppButton';
import Text from './common/Text';
import TextBox from './common/TextBox';

interface Props {
  data: ProductType;
  isCartView?: boolean;
  onImgClick?: TouchableOpacityProps['onPress'];
  onCartDataChange?: (
    data: ProductType[],
    dataChange: ProductType,
    isAdd?: boolean,
  ) => void;
  containerStyle?: ViewProps['style'];
}

const style = StyleSheet.create({
  container: {
    width: calcWidth(50),
    height: calcHeight(40),
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    backgroundColor: 'lightgray',
    '& > *': {
      padding: 20,
    },
  },
  field: {
    padding: 8,
  },
  textBox: {
    backgroundColor: 'white',
    paddingTop: 0,
    textAlign: 'center',
    paddingBottom: 0,
    width: 50,
  },
  remove: {
    backgroundColor: '#e02020',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
    margin: 16,
  },
  countCont: {
    height: 25,
    width: 25,
  },
  imgContainer: {width: '95%', height: '40%'},
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  quantityCont: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontStyle: 'italic',
    fontWeight: '600',
    textTransform: 'capitalize',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 16,
  },
  price: {color: 'green'},
});

export const ProductCard: React.FC<Props> = ({
  data,
  onImgClick,
  onCartDataChange,
  isCartView = false,
  containerStyle = {},
}) => {
  const {name, price, imageURI, stock, rating, quantity: qty} = data;
  const {cartItems} = useContext(AppContext);
  const [quantity, setQuantity] = useState(qty);

  const afterActionSequence = useCallback(
    (newData: ProductType[], changed: ProductType, isAdd = false) =>
      onCartDataChange?.(newData, changed, isAdd),
    [onCartDataChange],
  );

  const manipulateQuantity = useCallback(
    async (newQuantiy: number) => {
      let newCartItems = [...cartItems];
      const newData = {...data, quantity: newQuantiy};
      if (newCartItems) {
        newCartItems = newCartItems.filter(({id}) => id !== newData.id);
      }
      newCartItems = newCartItems.concat([newData]);

      if (newData.quantity === 0) {
        newCartItems = newCartItems.filter(({id}) => id !== newData.id);
      }

      afterActionSequence([...newCartItems], newData, newData.quantity > 0);
    },
    [afterActionSequence, cartItems, data],
  );

  const onRemoveCartClick = () => {
    setQuantity(0);
    manipulateQuantity(0);
  };

  useEffect(() => {
    setQuantity(qty);
  }, [qty]);

  const onRemoveQuantity = () => {
    const newQuantiy = quantity ? quantity - 1 : quantity;
    setQuantity(newQuantiy);
    manipulateQuantity(newQuantiy);
  };
  const onQuantityChange = (value: string): void => {
    const parsed = Number(value);

    if (parsed >= 0 && parsed <= stock) {
      setQuantity(parsed);
      manipulateQuantity(parsed);
    } else {
      setQuantity(quantity);
    }
  };
  const onAddQuantity = () => {
    setQuantity(quantity + 1);
    manipulateQuantity(quantity + 1);
  };
  return (
    <View style={[style.container, containerStyle]}>
      <TouchableOpacity style={style.imgContainer} onPress={onImgClick}>
        <Image alt={name} source={{uri: imageURI}} style={style.img} />
      </TouchableOpacity>
      <Text style={[style.name, style.field]}>{name}</Text>
      <Text style={[style.field]}>Stock Left : {stock}</Text>
      <Text style={[style.field]}>Rating : {rating}</Text>
      <Text style={[style.price, style.field]}>{price}$</Text>
      {isCartView ? (
        <>
          <AppButton
            onPress={onRemoveCartClick}
            title="Remove Item"
            style={style.remove}
          />
        </>
      ) : (
        <></>
      )}
      <View style={style.quantityCont}>
        <AppButton
          onPress={onRemoveQuantity}
          disabled={stock < 1 || quantity === 0}
          style={style.countCont}
          title="-"
        />
        <TextBox
          keyboardType="number-pad"
          onChangeText={onQuantityChange}
          style={{...style.countCont, ...style.textBox}}
          value={`${quantity}`}
        />
        <AppButton
          onPress={onAddQuantity}
          disabled={stock < 1 || quantity === stock}
          style={style.countCont}
          title="+"
        />
      </View>
    </View>
  );
};
