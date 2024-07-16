/* eslint-disable unused-imports/no-unused-vars */
import { useTranslate } from '@refinedev/core';
import { Button, Form, InputNumber, Modal, Table } from 'antd';
import React, { useState } from 'react';

import type { IProductInReturnOrder } from '../../../interfaces';

type Props = {
  data: IProductInReturnOrder[];
  onUpdate: (data: IProductInReturnOrder[]) => void;
};

export const ReturnOrderUpdate = ({ data, onUpdate }: Props) => {
  const t = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [products, setProducts] = useState<IProductInReturnOrder[]>(data);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      onUpdate(products);
      setIsModalVisible(false);
    });
  };

  const handleThornMoneyChange = (
    value: number,
    record: IProductInReturnOrder,
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === record.id ? { ...product, thornMoney: value } : product,
      ),
    );
  };

  const columns = [
    {
      title: t('orders.fields.productId'),
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: t('orders.fields.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: t('orders.fields.thornMoney'),
      dataIndex: 'thornMoney',
      key: 'thornMoney',
      render: (text: number, record: IProductInReturnOrder) => (
        <InputNumber
          min={0}
          value={record.thornMoney}
          onChange={(value) => handleThornMoneyChange(value as number, record)}
        />
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={showModal}>
        {t('orders.actions.edit')}
      </Button>
      <Modal
        title={t('orders.actions.edit')}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {t('orders.actions.cancel')}
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave}>
            {t('orders.actions.save')}
          </Button>,
        ]}
      >
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </>
  );
};
