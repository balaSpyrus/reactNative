import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import {useToast} from 'react-native-toast-notifications';
import Text from '../components/common/Text';
import TextBox from '../components/common/TextBox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ProductCard} from '../components/Products';
import {useProducts} from '../hooks/useProducts';
import {AppContext, PRIMARY_ACCENT, SECONDARY_ACCENT} from '../utils';
import {ProductType} from '../types';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';

const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 16},
  filterContainer: {
    paddingRight: 8,
    paddingLeft: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 10,
  },
  sortBy: {
    borderColor: SECONDARY_ACCENT,
    borderRadius: 25,
    padding: 12,
    fontWeight: '600',
    borderWidth: 2,
    color: SECONDARY_ACCENT,
  },
  filterField: {
    height: 45,
    margin: 0,
    paddingLeft: 12,
    paddingStart: 12,
    fontSize: 14,
    borderRadius: 25,
    backgroundColor: SECONDARY_ACCENT,
    color: 'white',
  },
  w100: {
    width: '100%',
  },
  w50: {
    width: '50%',
  },
  errorContainer: {alignItems: 'center', flex: 1, justifyContent: 'center'},
});

const commonProps = {
  textInputProps: {
    style: {
      borderRadius: 25,
      backgroundColor: SECONDARY_ACCENT,
      color: '#fff',
    },
  },
  inputContainerStyle: {
    backgroundColor: SECONDARY_ACCENT,
    borderRadius: 25,
  },
  showClear: false,
  clearOnFocus: false,
  closeOnBlur: true,
  closeOnSubmit: false,
};

const FilterOptions = [
  {title: 'By Name', id: 'name'},
  {title: 'By Price', id: 'price'},
  {title: 'By Stock', id: 'stock'},
  {title: 'By Rating', id: 'rating'},
];
const SortOptions = [
  {title: 'Ascending', id: 'asc'},
  {title: 'Decending', id: 'desc'},
];
const actions = [
  {
    name: 'rating',
    color: SECONDARY_ACCENT,
    text: 'Sort By Rating',
    icon: <Ionicons name="star-half" color="#fff" size={16} />,
  },
  {
    name: 'stock',
    color: SECONDARY_ACCENT,
    text: 'Sort By Stock',
    icon: <Ionicons name="albums" color="#fff" size={16} />,
  },
  {
    name: 'price',
    color: SECONDARY_ACCENT,
    text: 'Sort By Price',
    icon: <Ionicons name="cash" color="#fff" size={16} />,
  },
  {
    name: 'name',
    color: SECONDARY_ACCENT,
    text: 'Sort By Name',
    icon: <Ionicons name="text" color="#fff" size={16} />,
  },
];

const filterFunc = (
  data: ProductType[],
  field: string,
  value: string | number,
) => {
  if (value) {
    switch (field) {
      case 'name':
        return data.filter(({name}) =>
          `${name}`.toLowerCase().includes(`${value}`.toLowerCase()),
        );
      case 'stock':
        return data.filter(({stock}) => `${stock}`.includes(`${value}`));
      case 'price':
        return data.filter(({price}) => `${price}`.includes(`${value}`));
      case 'rating':
        return data.filter(({rating}) => `${rating}` === `${value}`);
      default:
        return data;
    }
  }

  return data;
};

const ProductList: React.FC = () => {
  const navigate = useNavigation();
  const toast = useToast();
  const {cartItems, setCartItems} = useContext(AppContext);
  const [filterValue, setFilterValue] = useState('');
  const [sortField, setSortField] = useState('name');
  const [order, setOrder] = useState<TAutocompleteDropdownItem>(SortOptions[0]);
  const [filterField, setFilterField] = useState<TAutocompleteDropdownItem>(
    FilterOptions[0],
  );
  const {filtered: filteredProducts, error} = useProducts(
    'https://raw.githubusercontent.com/mdmoin7/Random-Products-Json-Generator/master/products.json',
    {
      filterField: filterField?.id || 'name',
      filterValue,
      sortField,
      order: (order?.id as any) || 'asc',
      filterFunc,
    },
  );

  const onCartChange = (
    data: ProductType[],
    dataChange: ProductType,
    isAdd: boolean | undefined,
  ): void => {
    if (isAdd && dataChange.quantity === 1) {
      toast.show(`${dataChange?.name} added to cart`, {
        type: 'success',
      });
    } else if (!isAdd && dataChange.quantity === 0) {
      toast.show(`${dataChange?.name} removed from cart`, {
        type: 'danger',
      });
    }

    setCartItems(data);
  };
  return (
    <View style={styles.container}>
      {!error ? (
        <>
          <View
            style={[
              styles.filterContainer,
              Platform.select({android: {zIndex: 11}}),
            ]}>
            <Text style={[styles.sortBy, styles.w50]}>
              {`Sorted By ${sortField}`.toUpperCase()}
            </Text>
            <View
              style={[styles.w50, Platform.select({android: {zIndex: 11}})]}>
              <AutocompleteDropdown
                {...commonProps}
                containerStyle={styles.w100}
                showClear={false}
                clearOnFocus={false}
                closeOnSubmit={false}
                initialValue={{id: 'asc'}}
                onSelectItem={setOrder}
                dataSet={SortOptions}
              />
            </View>
          </View>

          <View
            style={[
              styles.filterContainer,
              Platform.select({android: {zIndex: 10}}),
            ]}>
            <AutocompleteDropdown
              {...commonProps}
              containerStyle={styles.w50}
              initialValue={{id: 'name'}}
              onSelectItem={setFilterField}
              dataSet={FilterOptions}
            />
            <TextBox
              placeholderTextColor="white"
              style={{...styles.filterField, ...styles.w50}}
              value={filterValue}
              keyboardType={
                filterField?.id !== 'name' ? 'number-pad' : 'default'
              }
              onChangeText={setFilterValue}
              placeholder={`Type ${filterField?.id} to Search`}
            />
          </View>
          <FlatList
            ListEmptyComponent={
              <View style={styles.errorContainer}>
                {filterValue.length ? (
                  <Text>No Products Found</Text>
                ) : (
                  <ActivityIndicator size="large" color={PRIMARY_ACCENT} />
                )}
              </View>
            }
            scrollEnabled
            numColumns={2}
            initialNumToRender={10}
            data={filteredProducts}
            renderItem={({item}) => (
              <ProductCard
                data={{...item, ...cartItems.find(({id}) => id === item.id)}}
                onCartDataChange={onCartChange}
                onImgClick={() =>
                  navigate.navigate('Details', {
                    data: item,
                  })
                }
              />
            )}
            keyExtractor={data => `${data.id}`}
          />
          <FloatingAction
            actions={actions}
            buttonSize={48}
            showBackground={false}
            floatingIcon={
              <Ionicons name="funnel-sharp" color="#fff" size={20} />
            }
            color={SECONDARY_ACCENT}
            onPressItem={selected => setSortField(selected ?? 'name')}
          />
        </>
      ) : (
        <View style={styles.errorContainer}>
          <Text>{error}</Text>
        </View>
      )}
    </View>
  );
};

export default ProductList;
