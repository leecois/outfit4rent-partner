import { NumberField } from '@refinedev/antd';
import { useApiUrl } from '@refinedev/core';
import { Avatar, Flex, Table, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

import type { IOrder, IProductList } from '../../../interfaces';

type Props = {
  order?: IOrder;
};

export const OrderProducts = ({ order }: Props) => {
  const apiUrl = useApiUrl();
  const [products, setProducts] = useState<IProductList[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Thêm state loading

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const response = await axios.get(
          `${apiUrl}/orders/${order?.id}/products`,
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    if (order?.id) {
      fetchProducts();
    }
  }, [apiUrl, order?.id]);

  let total = order?.price || 0;
  products.forEach((product) => {
    total += product.quantity * (order?.price || 0) * product.deposit;
  });

  return (
    <Table
      dataSource={products}
      loading={loading}
      pagination={false}
      scroll={{ x: true }}
      footer={() => (
        <Flex justify="flex-end" vertical>
          <Flex justify="flex-end" gap={16}>
            <Typography.Text>Package Price</Typography.Text>
            <NumberField
              value={order?.price || 0}
              options={{ style: 'currency', currency: 'USD' }}
            />
          </Flex>
          <Flex justify="flex-end" gap={16}>
            <Typography.Text>Total</Typography.Text>
            <NumberField
              value={total}
              options={{ style: 'currency', currency: 'USD' }}
            />
          </Flex>
        </Flex>
      )}
    >
      <Table.Column<IProductList>
        title="Product"
        dataIndex="name"
        key="name"
        render={(_, record) => {
          const image = record.images?.[0];
          return (
            <Flex gap={16} align="center">
              <Avatar shape="square" src={image?.url} alt={record.name} />
              <Typography.Text>{record.name}</Typography.Text>
            </Flex>
          );
        }}
      />
      <Table.Column<IProductList>
        align="end"
        title="Quantity"
        dataIndex="quantity"
        key="quantity"
      />
      <Table.Column<IProductList>
        title="Deposit"
        dataIndex="deposit"
        align="end"
        key="deposit"
        render={(value) => (
          <NumberField
            value={value * (order?.price || 0)}
            options={{ style: 'currency', currency: 'USD' }}
          />
        )}
      />
      <Table.Column<IProductList>
        title="Total"
        dataIndex="id"
        align="end"
        key="total"
        render={(_, record) => (
          <NumberField
            value={record.quantity * (order?.price || 0) * record.deposit}
            options={{ style: 'currency', currency: 'USD' }}
          />
        )}
      />
    </Table>
  );
};
