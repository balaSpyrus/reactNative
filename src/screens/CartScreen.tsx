import {useNavigation} from '@react-navigation/native';
import {sortBy} from 'lodash';
import React, {useContext, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import AppButton from '../components/common/AppButton';
import Modal from '../components/common/Modal';
import Text from '../components/common/Text';
import {ProductCard} from '../components/Products';
import {AppContext, SECONDARY_ACCENT} from '../utils';

const styles = StyleSheet.create({
  mainContainer: {flex: 1, paddingTop: 16, paddingBottom: 16},
  listContainer: {marginTop: 16},
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    flex: 0,
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topDiv: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: SECONDARY_ACCENT,
  },
  bottomDiv: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: SECONDARY_ACCENT,
  },
  bold: {
    fontWeight: '600',
  },
  modal: {
    padding: 16,
    minHeight: 200,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
  },
  name: {width: '60%'},
  qty: {width: '10%', textAlign: 'right'},
  amt: {width: '30%', textAlign: 'right'},
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const CartScreen = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const {setCartItems, cartItems} = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);

  const CheckoutModal = () => (
    <Modal isOpen={showModal}>
      <View style={styles.modal}>
        <View style={[styles.cartItem, styles.bottomDiv]}>
          <Text style={[styles.name, styles.bold]}>Name</Text>
          <Text style={[styles.qty, styles.bold]}>Qty</Text>
          <Text style={[styles.amt, styles.bold]}>Amount</Text>
        </View>
        {cartItems.map(({id, name, price, quantity}) => (
          <View key={id} style={styles.cartItem}>
            <View style={styles.name}>
              <Text>{name}</Text>
              <Text>{`(${price}$)`}</Text>
            </View>
            <Text style={styles.qty}>{quantity}</Text>
            <Text style={styles.amt}>
              {(quantity * Number(price)).toFixed(2)}$
            </Text>
          </View>
        ))}
        <View style={[styles.cartItem, styles.topDiv]}>
          <Text style={styles.bold}>Total</Text>
          <Text style={styles.bold}>
            {cartItems
              .reduce(
                (acc, {price, quantity}) => acc + Number(price) * quantity,
                0,
              )
              .toFixed(2)}
            $
          </Text>
        </View>
        <AppButton title="back" onPress={() => setShowModal(false)} />
      </View>
    </Modal>
  );

  return (
    <View style={styles.mainContainer}>
      {cartItems.length > 0 ? (
        <>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <AppButton
              onPress={() => {
                setCartItems([]);
                toast.show(`Cart Emptied!!`, {
                  type: 'danger',
                });
              }}
              style={{
                backgroundColor: 'transparent',
                borderWidth: 1,
                shadowColor: 'transparent',
                borderColor: SECONDARY_ACCENT,
              }}
              textProps={{
                style: {
                  color: SECONDARY_ACCENT,
                },
              }}
              title="Empty Cart"
            />
            <AppButton
              style={{
                backgroundColor: 'green',
              }}
              onPress={() => {
                setShowModal(true);
              }}
              title="checkout"
            />
          </View>
          <FlatList
            style={styles.listContainer}
            scrollEnabled
            numColumns={2}
            initialNumToRender={10}
            data={sortBy(cartItems, 'name')}
            renderItem={({item}) => (
              <ProductCard
                data={item}
                isCartView
                onCartDataChange={(data, changed, isAdd) => {
                  if (!isAdd) {
                    toast.show(`${changed?.name} removed from cart`, {
                      type: 'danger',
                    });
                  }
                  setCartItems(data);
                }}
                onImgClick={() =>
                  navigation.navigate('Details', {
                    data: item,
                  })
                }
              />
            )}
            keyExtractor={data => `${data.id}`}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text>Cart is Empty</Text>
        </View>
      )}
      <CheckoutModal />
    </View>
  );
};

export default CartScreen;
