import { List } from '@refinedev/antd';
import { useShow, useTranslate } from '@refinedev/core';
import { Col, Divider, Flex, Row, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';

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

  return (
    <>
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
