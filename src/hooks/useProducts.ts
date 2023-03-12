import {orderBy} from 'lodash';
import {useEffect, useState} from 'react';
import {ProductType} from '../types';

type ProductResponse = {
  productId: number;
  productName: string;
  productImage: string;
  productStock: number;
  productPrice: string;
  productSalePrice: string;
  rating: number;
};

const transformData = (data: ProductResponse[]) =>
  data.map(
    ({
      productId,
      productImage,
      productName,
      productPrice,
      productStock,
      rating,
    }) =>
      ({
        id: productId,
        name: productName,
        imageURI: productImage,
        price: productPrice,
        stock: productStock,
        quantity: 0,
        rating,
      } as ProductType),
  );

export const useProducts = (
  endpoint = '',
  {
    filterFunc,
    filterField = '',
    filterValue = '',
    sortField = '',
    order = 'asc',
  }: {
    filterField?: string;
    filterValue?: string;
    sortField?: string;
    filterFunc?: (
      data: ProductType[],
      field: string,
      value: string | number,
    ) => ProductType[];
    order?: 'asc' | 'desc';
  },
) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(endpoint)
      .then(data => data.json())
      .then(data => setProducts(transformData(data)))
      .catch(setError);
  }, [endpoint]);

  useEffect(() => {
    const filtered = filterFunc
      ? filterFunc(products, filterField, filterValue)
      : products.filter(({name}) =>
          name.toLowerCase().includes(filterValue.toLowerCase()),
        );

    setFilteredProducts(orderBy(filtered, sortField, order));
  }, [filterValue, products, sortField, order, filterFunc, filterField]);

  return {filtered: filteredProducts, products, error};
};
