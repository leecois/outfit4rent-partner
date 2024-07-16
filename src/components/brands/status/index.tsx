import { EyeOutlined, StopOutlined } from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Tag, theme, Typography } from 'antd';

import { useConfigProvider } from '../../../context';
import type { IBrand } from '../../../interfaces';

type Props = {
  value: IBrand['status'];
};

export const BrandStatus = ({ value }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const { mode } = useConfigProvider();
  const isDark = mode === 'dark';

  let textColor;
  if (value) {
    textColor = isDark ? token.green7 : '#3C8618';
  } else {
    textColor = token.colorTextTertiary;
  }
  return (
    <Tag
      color={value ? 'green' : 'default'}
      style={{
        color: textColor,
      }}
      icon={value ? <EyeOutlined /> : <StopOutlined />}
    >
      <Typography.Text
        style={{
          color: textColor,
        }}
      >
        {t(`brands.fields.status.${value}`)}
      </Typography.Text>
    </Tag>
  );
};
