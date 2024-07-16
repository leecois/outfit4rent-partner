import {
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Card, List, Typography } from 'antd';
import React from 'react';

import type { IUser } from '../../../interfaces';
import { UserStatus } from '../userStatus';

type Props = {
  customer?: IUser;
};

export const CustomerInfoList = ({ customer }: Props) => {
  const t = useTranslate();

  return (
    <Card
      bordered={false}
      styles={{
        body: {
          padding: '0 16px 0 16px',
        },
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={[
          {
            title: t('customers.fields.phone'),
            icon: <PhoneOutlined />,
            value: <Typography.Text>{customer?.phone}</Typography.Text>,
          },
          {
            title: t('users.fields.address'),
            icon: <EnvironmentOutlined />,
            value: <Typography.Text>{customer?.address}</Typography.Text>,
          },
          {
            title: t('users.fields.status.label'),
            icon: <UserOutlined />,
            value: <UserStatus value={customer?.status ?? 0} />,
          },
        ]}
        renderItem={(item) => {
          return (
            <List.Item>
              <List.Item.Meta
                avatar={item.icon}
                title={
                  <Typography.Text type="secondary">
                    {item.title}
                  </Typography.Text>
                }
                description={item.value}
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};
