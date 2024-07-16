import { CloseCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { List, ListButton } from '@refinedev/antd';
import { useApiUrl, useShow, useTranslate } from '@refinedev/core';
import { Button, Col, Divider, Flex, message, Row, Skeleton } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { ButtonSuccess } from '../../button';
import {
  CardWithContent,
  OrderDeliveryDetails,
  OrderProducts,
} from '../../components';
import type { IOrder } from '../../interfaces';

export const OrderShow = () => {
  const t = useTranslate();
  const { queryResult } = useShow<IOrder>();
  const { data, isLoading } = queryResult;
  const [record, setRecord] = useState<IOrder | undefined>(data?.data);

  useEffect(() => {
    if (data?.data) {
      setRecord(data.data);
    }
  }, [data]);

  const apiUrl = useApiUrl();

  const handleUpdateStatus = async (id: number, status: number) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/orders/${id}/status/${status}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 500) {
        throw new Error('Network response was not ok');
      }

      const updatedOrder = (await response.data.data) as IOrder;
      message.success(`Order ${id} status updated to ${status}`);
      setRecord(updatedOrder);
    } catch (error) {
      message.error(`Failed to update order ${id} status`);
    }
  };

  const canAcceptOrder = isLoading ? false : record?.status === 0;
  const canRejectOrder = isLoading ? false : record?.status === 0;

  return (
    <>
      <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <ListButton icon={<LeftOutlined />}>{t('orders.orders')}</ListButton>
        <Divider type="vertical" />
        <div>
          <ButtonSuccess
            disabled={!canAcceptOrder}
            style={{ marginRight: 8 }}
            onClick={() => {
              handleUpdateStatus((record as IOrder)?.id, 1);
            }}
          >
            {t('buttons.accept')}
          </ButtonSuccess>
          <Button
            disabled={!canRejectOrder}
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => {
              handleUpdateStatus((record as IOrder)?.id, -1);
            }}
          >
            {t('buttons.reject')}
          </Button>
        </div>
      </Flex>
      <Divider />
      <List
        breadcrumb={false}
        title={
          isLoading ? (
            <Skeleton.Input
              active
              style={{
                width: '144px',
                minWidth: '144px',
                height: '28px',
              }}
            />
          ) : (
            `${t('orders.titles.list')} #${record?.id}`
          )
        }
      >
        <Row gutter={[16, 16]}>
          <Col xl={15} lg={24} md={24} sm={24} xs={24}>
            <Flex gap={16} vertical>
              <OrderProducts order={record} />
            </Flex>
          </Col>

          <Col xl={9} lg={24} md={24} sm={24} xs={24}>
            <CardWithContent
              bodyStyles={{
                padding: '16px',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              title={t('orders.titles.deliveryDetails')}
            >
              {record && <OrderDeliveryDetails order={record} />}
            </CardWithContent>
          </Col>
        </Row>
      </List>
    </>
  );
};
