import {
  ClockCircleOutlined,
  PhoneOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Flex, Grid, List, Space, theme, Typography } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import { useConfigProvider } from '../../../context';
import type { IOrder } from '../../../interfaces';
import { BikeWhiteIcon } from '../../icons';

type Props = {
  order: IOrder;
};
// const getCurrentStep = (order: IOrder) => {
//   return order?.events.findIndex(
//     (element) => element.status === order?.status?.text,
//   );
// };

// const getNotFinishedCurrentStep = (
//   order: IOrder,
//   event: IEvent,
//   index: number,
// ) => {
//   return (
//     event.status !== 'Cancelled' &&
//     event.status !== 'Delivered' &&
//     order?.events.findIndex(
//       (element) => element.status === order?.status?.text,
//     ) === index
//   );
// };
// const getStepStatus = (order: IOrder, event: IEvent, index: number) => {
//   if (!event.date) return 'wait';
//   if (event.status === 'Cancelled') return 'error';
//   if (getNotFinishedCurrentStep(order, event, index)) return 'process';
//   return 'finish';
// };
export const OrderDeliveryDetails = ({ order }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  // eslint-disable-next-line unused-imports/no-unused-vars
  const breakpoints = Grid.useBreakpoint();
  const { mode } = useConfigProvider();

  const details = useMemo(() => {
    const list: Array<{
      icon: React.ReactNode;
      title: string;
      description: string;
    }> = [
      {
        icon: <ClockCircleOutlined />,
        title: t('orders.fields.dateFrom'),
        description: dayjs(order.dateFrom).format('DD/MM/YYYY'),
      },
      {
        icon: <ClockCircleOutlined />,
        title: t('orders.fields.dateTo'),
        description: dayjs(order.dateTo).format('DD/MM/YYYY'),
      },
      {
        icon: <ShopOutlined />,
        title: t('orders.fields.receiverAddress'),
        description: order.receiverAddress,
      },
      {
        icon: <BikeWhiteIcon />,
        title: t('orders.fields.receiverName'),
        description: order.receiverName,
      },
      {
        icon: <PhoneOutlined />,
        title: t('orders.fields.receiverPhone'),
        description: order.receiverPhone,
      },
      {
        icon: <UserOutlined />,
        title: t('orders.fields.customerId'),
        description: `${order.customerId}`,
      },
    ];

    return list;
  }, [order]);

  return (
    <Flex vertical>
      <List
        size="large"
        dataSource={details}
        style={{
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
        renderItem={(item) => (
          <List.Item>
            <Flex gap={8}>
              <Space
                style={{
                  width: '120px',
                }}
              >
                <div
                  style={{
                    color: mode === 'dark' ? token.volcano9 : token.volcano6,
                  }}
                >
                  {item.icon}
                </div>
                <Typography.Text type="secondary">{item.title}</Typography.Text>
              </Space>
              <Typography.Text>{item.description}</Typography.Text>
            </Flex>
          </List.Item>
        )}
      />
    </Flex>
  );
};
