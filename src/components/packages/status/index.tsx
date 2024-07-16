import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Tag, theme, Typography } from 'antd';

import { useConfigProvider } from '../../../context';
import type { IPackage } from '../../../interfaces';

type Status = IPackage['status'];

type Props = {
  value?: Status;
};

export const PackageStatus = ({ value }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const { mode } = useConfigProvider();
  const isDark = mode === 'dark';
  let color;
  if (value) {
    color = isDark ? token.green7 : '#3C8618';
  } else {
    color = isDark ? token.colorTextTertiary : token.colorTextTertiary;
  }

  return (
    <Tag
      color={value ? 'green' : 'default'}
      style={{
        color: value ? token.colorSuccess : token.colorTextTertiary,
        marginInlineEnd: 0,
      }}
      icon={value ? <CheckCircleOutlined /> : <StopOutlined />}
    >
      <Typography.Text
        style={{
          color,
        }}
      >
        {t(`products.fields.status.${value}`)}
      </Typography.Text>
    </Tag>
  );
};
