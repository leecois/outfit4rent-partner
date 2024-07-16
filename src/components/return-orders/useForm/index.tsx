/* eslint-disable @typescript-eslint/no-shadow */
import { useApiUrl } from '@refinedev/core';
import form from 'antd/es/form';
import axios from 'axios';
import { useEffect, useState } from 'react';

import type { IProductInReturnOrder, IReturnOrder } from '../../../interfaces';

type Props = {
  returnOrderId: number;
};

export const useReturnOrderForm = (props: Props) => {
  const { returnOrderId } = props;
  const [returnOrderData, setReturnOrderData] = useState<IReturnOrder | null>(
    null,
  );
  const apiUrl = useApiUrl();
  const [productInReturnOrders, setProductInReturnOrders] = useState<
    IProductInReturnOrder[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackageData = async () => {
      setLoading(true);
      try {
        const returnOrderResponse = await axios.get(
          `${apiUrl}/return-orders/${returnOrderId}`,
        );
        setReturnOrderData(returnOrderResponse.data.data);

        const productInReturnOrderResponse = await axios.get(
          `${apiUrl}/return-orders/${returnOrderId}/products`,
        );
        const fetchedProductInReturnOrderPackages: IProductInReturnOrder[] =
          productInReturnOrderResponse.data.data;
        setProductInReturnOrders(fetchedProductInReturnOrderPackages);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchPackageData();
  }, [returnOrderId, apiUrl]);

  return {
    ...form,
    returnOrderData,
    productInReturnOrders,
    loading,
    error,
  };
};
