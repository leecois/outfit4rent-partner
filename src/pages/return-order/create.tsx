import { useApiUrl, useGetToPath, useGo, useTranslate } from '@refinedev/core';
import {
  Button,
  Flex,
  Form,
  Image,
  Input,
  message,
  message,
  Modal,
  Table,
  Tag,
} from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type {
  IOrder,
  IProductInOrder,
  IProductInReturnOrder,
  IProductList,
  IReturnOrder,
} from '../../interfaces';

const useFormList = (data: IOrder[]) => {
  const [chosenOrder, setChosenOrder] = useState<IOrder>();
  const t = useTranslate();
  const partnerId = Number(localStorage.getItem('PARTNER_ID'));

  useEffect(() => {
    if (data.length > 0) {
      setChosenOrder(data[0]);
    }
  }, [data]);

  return {
    chosenOrder,
    setChosenOrder,
    t,
    partnerId,
  };
};

export const ReturnOrderCreate = () => {
  const [form] = Form.useForm();
  const getToPath = useGetToPath();
  const [isEnable, setIsEnable] = useState<boolean>(false);
  const apiUrl = useApiUrl();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const [orderData, setOrderData] = useState<IOrder[]>([]);
  const [productsInOrderData, setProductsInOrderData] = useState<
    IProductInOrder[]
  >([]);
  const [productsInReturnOrderData, setProductsInReturnOrderData] = useState<
    IProductInReturnOrder[]
  >([]);
  const [products, setProducts] = useState<IProductList[]>([]);
  const [searchOrderCode, setSearchOrderCode] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiUrl}/orders/not-returned-money`);
        setOrderData(response.data.data);
        setIsEnable(true);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products`);
        const fetchedProducts = response.data.data;
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchOrders();
    fetchProducts();
  }, [apiUrl]);

  const handleModalClose = () => {
    go({
      to: searchParams.get('to') ?? getToPath({ action: 'list' }) ?? '',
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: 'replace',
    });
  };

  const handleProductChange = (
    productId: number,
    field: string,
    value: any,
  ) => {
    console.log(
      `Updating product ${productId} field ${field} with value ${value}`,
    );
    const updatedProducts = productsInReturnOrderData.map((product) =>
      product.productId === productId
        ? {
            ...product,
            [field]: value,
          }
        : product,
    );
    setProductsInReturnOrderData(updatedProducts);
  };

  useEffect(() => {
    console.log(productsInReturnOrderData);
  }, [productsInReturnOrderData]);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { chosenOrder, setChosenOrder, t, partnerId } = useFormList(orderData);

  const handleSearchOrder = () => {
    const returnOrderData = products.map(
      (item: IProductList) =>
        ({
          id: 0,
          productId: item.id,
          quantity: 0,
          damagedLevel: 0,
          thornMoney: 0,
          description: '',
          status: 0,
          returnOrderId: 0,
          product: item,
        }) as IProductInReturnOrder,
    );
    setProductsInReturnOrderData(returnOrderData);

    const selectedOrder = orderData.find(
      (order) => order.orderCode === searchOrderCode,
    );
    if (selectedOrder) {
      setChosenOrder(selectedOrder);

      const filteredProductsInReturnOrderData = returnOrderData.filter((item) =>
        selectedOrder.itemInUsers.some((x) => x.productId === item.productId),
      );
      const mappingQuantity = filteredProductsInReturnOrderData.map((item) => ({
        ...item,
        quantity:
          selectedOrder.itemInUsers.find((y) => y.productId === item.productId)
            ?.quantity || item.quantity,
      })) as IProductInReturnOrder[];

      setProductsInReturnOrderData(mappingQuantity);
      setProductsInOrderData(selectedOrder.itemInUsers || []);
    } else {
      setProductsInOrderData([]);
      setProductsInReturnOrderData([]);

      message.error('Order not found');
    }
  };

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'productId',
      key: 'productImage',
      render: (productId: number) => {
        const product = products.find((p) => p.id === productId);
        return product ? (
          <Image src={product.images[0]?.url} width={50} height={50} />
        ) : null;
      },
    },
    {
      title: 'Product Name',
      dataIndex: 'productId',
      key: 'productName',
      render: (productId: number, record: IProductInReturnOrder) => {
        const product = products.find((p) => p.id === productId);
        return (
          <Flex vertical>
            {record.quantity <= 0 && (
              <Tag title="Enough Returned Item" color="green" icon="{}" />
            )}
            {product ? product.name : ''}
          </Flex>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: number, record: IProductInReturnOrder) => (
        <Input
          disabled={record.quantity <= 0}
          type="number"
          defaultValue={record.quantity}
          onChange={(e) =>
            handleProductChange(
              record.productId,
              'quantity',
              Number(e.target.value),
            )
          }
        />
      ),
    },
    {
      title: 'Damaged Level',
      dataIndex: 'damagedLevel',
      key: 'damagedLevel',
      render: (text: number, record: IProductInReturnOrder) => (
        <Input
          disabled={record.quantity <= 0}
          type="number"
          defaultValue={text}
          onChange={(e) =>
            handleProductChange(
              record.productId,
              'damagedLevel',
              Number(e.target.value),
            )
          }
        />
      ),
    },
    {
      title: 'Thorn Money',
      dataIndex: 'thornMoney',
      key: 'thornMoney',
      render: (text: number, record: IProductInReturnOrder) => (
        <Input
          disabled={record.quantity <= 0}
          type="number"
          defaultValue={record.thornMoney}
          onChange={(e) =>
            handleProductChange(
              record.productId,
              'thornMoney',
              Number(e.target.value),
            )
          }
        />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: IProductInReturnOrder) => (
        <Input
          disabled={record.quantity <= 0}
          defaultValue={record.description}
          onChange={(e) =>
            handleProductChange(record.productId, 'description', e.target.value)
          }
        />
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const returnOrder: IReturnOrder = {
        partnerId,
        customerPackageId: chosenOrder?.id || 0,
        customerId: 0,
        dateReturn: new Date(),
        name: values.name,
        address: values.address,
        phone: values.phone,
        productReturnOrders: productsInReturnOrderData
          .filter((item) => item.quantity > 0)
          .map((product) => ({
            id: product.id,
            status: product.status,
            returnOrderId: product.returnOrderId,
            productId: product.productId,
            quantity: product.quantity,
            damagedLevel: product.damagedLevel,
            thornMoney: product.thornMoney,
            description: product.description,
            product: product.product,
          })),
        id: 0,
        status: 0,
        totalThornMoney: 0,
        quantityOfItems: 0,
        createdAt: new Date(),
      };

      const response = await axios.post(`${apiUrl}/return-orders`, returnOrder);
      if (response.status === 200) {
        message.success('Return order created successfully');
        handleModalClose();
      } else {
        message.error('Failed to create return order');
      }
    } catch (error) {
      console.error('Error submitting return order:', error);
      message.error('Error submitting return order');
    }
  };

  const getRowClassName = (record: IProductInReturnOrder) => {
    return record.quantity <= 0 ? 'row-disabled' : ''; // 'row-disabled' is a custom CSS class
  };
  return (
    <Modal
      open
      destroyOnClose
      maskClosable={false}
      title="Create Return Order"
      footer={
        <Flex align="center" justify="space-between">
          <Button onClick={handleModalClose}>Cancel</Button>
          <Flex align="center" gap={16}>
            <Button type="primary" disabled={!isEnable} onClick={handleSubmit}>
              Submit
            </Button>
          </Flex>
        </Flex>
      }
      onCancel={handleModalClose}
      style={{ top: 20 }}
      width="80%"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Partner ID" hidden>
          <Input value={partnerId} disabled />
        </Form.Item>
        <Form.Item label="Order Code">
          <Flex>
            <Input
              value={searchOrderCode}
              onChange={(e) => setSearchOrderCode(e.target.value)}
              placeholder="Enter order code"
            />
            <Button
              onClick={handleSearchOrder}
              type="primary"
              style={{ marginLeft: '8px' }}
            >
              Search
            </Button>
          </Flex>
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter the address' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please enter the phone number' }]}
        >
          <Input />
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={productsInReturnOrderData}
        rowKey="productId"
        rowClassName={getRowClassName}
      />
    </Modal>
  );
};
