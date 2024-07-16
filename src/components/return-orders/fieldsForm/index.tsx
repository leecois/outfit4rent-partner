import {
  ClockCircleOutlined,
  MoneyCollectOutlined,
  PhoneOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Flex, Grid, List, Space, theme, Typography } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import { useConfigProvider } from '../../../context';
import type { IReturnOrder } from '../../../interfaces';
import { BikeWhiteIcon } from '../../icons';

type Props = {
  order: IReturnOrder;
};

export const ReturnOrderDetails = ({ order }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  // eslint-disable-next-line unused-imports/no-unused-vars
  const breakpoints = Grid.useBreakpoint();
  const { mode } = useConfigProvider();
  const getOrderStatusDescription = (status: number) => {
    switch (status) {
      case 0:
        return t('enum.return-order.status.0');
      case -1:
        return t('enum.return-order.status.-1');
      default:
        return t('enum.return-order.status.1');
    }
  };
  const details = useMemo(() => {
    const list: Array<{
      icon: React.ReactNode;
      title: string;
      description: string;
    }> = [
      {
        icon: <ClockCircleOutlined />,
        title: t('return-orders.fields.dateReturn'),
        description: dayjs(order?.dateReturn as Date).format('DD/MM/YYYY'),
      },
      {
        icon: <MoneyCollectOutlined />,
        title: t('return-orders.fields.totalThornMoney'),
        description: `${order?.totalThornMoney} $`,
      },
      {
        icon: <ShopOutlined />,
        title: t('return-orders.fields.address'),
        description: order?.address,
      },
      {
        icon: <BikeWhiteIcon />,
        title: t('return-orders.fields.name'),
        description: order?.name,
      },
      {
        icon: <PhoneOutlined />,
        title: t('return-orders.fields.phone'),
        description: order?.phone,
      },
      {
        icon: <UserOutlined />,
        title: t('return-orders.fields.customerId'),
        description: `${order?.customerId}`,
      },
      {
        icon: <ShopOutlined />,
        title: t('return-orders.fields.partnerId'),
        description: `${order?.partnerId}`,
      },
      {
        icon: <ShopOutlined />,
        title: t('return-orders.fields.status'),
        description: getOrderStatusDescription(order?.status),
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
