import { CheckCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Tag, theme, Typography } from 'antd';
import React from 'react';

import type { IUser } from '../../../interfaces';

type Props = {
  value: IUser['status'];
};

export const UserStatus = ({ value }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();

  const statusText =
    value === 1
      ? t('users.fields.status.active')
      : t('users.fields.status.inactive');
  const statusIcon =
    value === 1 ? <CheckCircleOutlined /> : <PauseCircleOutlined />;
  const statusColor = value === 1 ? 'green' : 'default';
  const textColor = value === 1 ? token.colorSuccess : token.colorTextTertiary;

  return (
    <Tag
      color={statusColor}
      style={{
        color: textColor,
      }}
      icon={statusIcon}
    >
      <Typography.Text
        style={{
          color: textColor,
        }}
      >
        {statusText}
      </Typography.Text>
    </Tag>
  );
};
