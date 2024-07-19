import {
  useCreate,
  useGetIdentity,
  useGetToPath,
  useGo,
  useList,
  useTranslate,
} from '@refinedev/core';
import {
  Button,
  Flex,
  Form,
  Image,
  Input,
  message,
  Modal,
  Table,
  Tag,
} from 'antd';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type {
  IOrder,
  IProductInReturnOrder,
  IProductList,
  IReturnOrder,
} from '../../interfaces';

export const ReturnOrderCreate: React.FC = () => {
  const [form] = Form.useForm();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { data: identity } = useGetIdentity<{ id: number }>();
  const partnerId = identity?.id || 0;

  const [searchOrderCode, setSearchOrderCode] = useState<string>('');
  const [chosenOrder, setChosenOrder] = useState<IOrder>();
  const [productsInReturnOrderData, setProductsInReturnOrderData] = useState<
    IProductInReturnOrder[]
  >([]);

  const { data: orderData, isLoading: isOrderLoading } = useList<IOrder>({
    resource: 'orders/not-returned-money',
  });

  const { data: products, isLoading: isProductLoading } = useList<IProductList>(
    {
      resource: 'products',
    },
  );

  const { mutate: createReturnOrder, isLoading: isCreating } = useCreate();

  const handleModalClose = () => {
    go({
      to: searchParams.get('to') ?? getToPath({ action: 'list' }) ?? '',
      query: { to: undefined },
      options: { keepQuery: true },
      type: 'replace',
    });
  };

  const handleProductChange = (
    productId: number,
    field: string,
    value: any,
  ) => {
    setProductsInReturnOrderData((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === productId
          ? { ...product, [field]: value }
          : product,
      ),
    );
  };

  const handleSearchOrder = () => {
    if (!orderData?.data || !products?.data) return;

    const returnOrderData = products.data.map((item) => ({
      id: 0,
      productId: item.id,
      quantity: 0,
      damagedLevel: 0,
      thornMoney: 0,
      description: '',
      status: 0,
      returnOrderId: 0,
      product: item,
    }));

    const selectedOrder = orderData.data.find(
      (order) => order.orderCode === searchOrderCode,
    );
    if (selectedOrder) {
      setChosenOrder(selectedOrder);

      const filteredProducts = returnOrderData
        .filter((item) =>
          selectedOrder.itemInUsers.some((x) => x.productId === item.productId),
        )
        .map((item) => ({
          ...item,
          quantity:
            selectedOrder.itemInUsers.find(
              (y) => y.productId === item.productId,
            )?.quantity || item.quantity,
        }));

      setProductsInReturnOrderData(filteredProducts);
    } else {
      setProductsInReturnOrderData([]);
      message.error('Order not found');
    }
  };

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
          .map(
            ({
              id,
              status,
              returnOrderId,
              productId,
              quantity,
              damagedLevel,
              thornMoney,
              description,
              product,
            }) => ({
              id,
              status,
              returnOrderId,
              productId,
              quantity,
              damagedLevel,
              thornMoney,
              description,
              product,
            }),
          ),
        id: 0,
        status: 0,
        totalThornMoney: 0,
        quantityOfItems: 0,
        createdAt: new Date(),
      };

      createReturnOrder(
        { resource: 'return-orders', values: returnOrder },
        {
          onSuccess: () => {
            message.success('Return order created successfully');
            handleModalClose();
          },
          onError: () => {
            message.error('Failed to create return order');
          },
        },
      );
    } catch (error) {
      console.error('Error submitting return order:', error);
      message.error('Error submitting return order');
    }
  };

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'productId',
      key: 'productImage',
      render: (productId: number) => {
        const product = products?.data?.find((p) => p.id === productId);
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
        const product = products?.data?.find((p) => p.id === productId);
        return (
          <Flex vertical>
            {record.quantity <= 0 && (
              <Tag color="green">Enough Returned Item</Tag>
            )}
            {product?.name}
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
          value={record.quantity}
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
          value={record.damagedLevel}
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
          value={record.thornMoney}
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
          value={record.description}
          onChange={(e) =>
            handleProductChange(record.productId, 'description', e.target.value)
          }
        />
      ),
    },
  ];

  return (
    <Modal
      open
      destroyOnClose
      maskClosable={false}
      title={t('return-orders.titles.create')}
      footer={
        <Flex align="center" justify="space-between">
          <Button onClick={handleModalClose}>{t('buttons.cancel')}</Button>
          <Button
            type="primary"
            disabled={isOrderLoading || isProductLoading || isCreating}
            onClick={handleSubmit}
          >
            {t('buttons.accept')}
          </Button>
        </Flex>
      }
      onCancel={handleModalClose}
      style={{ top: 20 }}
      width="80%"
    >
      <Form form={form} layout="vertical">
        <Form.Item label={t('return-orders.fields.partnerId')} hidden>
          <Input value={partnerId} disabled />
        </Form.Item>
        <Form.Item label={t('return-orders.fields.orderCode')}>
          <Flex>
            <Input
              value={searchOrderCode}
              onChange={(e) => setSearchOrderCode(e.target.value)}
              placeholder={t('return-orders.fields.orderCode')}
            />
            <Button
              onClick={handleSearchOrder}
              type="primary"
              style={{ marginLeft: '8px' }}
            >
              {t('buttons.search')}
            </Button>
          </Flex>
        </Form.Item>
        <Form.Item
          name="name"
          label={t('return-orders.fields.name')}
          rules={[
            { required: true, message: t('return-orders.fields.nameRequired') },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label={t('return-orders.fields.address')}
          rules={[
            {
              required: true,
              message: t('return-orders.fields.addressRequired'),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label={t('return-orders.fields.phone')}
          rules={[
            {
              required: true,
              message: t('return-orders.fields.phoneRequired'),
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={productsInReturnOrderData}
        rowKey="productId"
        rowClassName={(record) => (record.quantity <= 0 ? 'row-disabled' : '')}
      />
    </Modal>
  );
};
