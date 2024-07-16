import { EyeOutlined, StopOutlined } from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Tag, theme, Typography } from 'antd';

import { useConfigProvider } from '../../../context';
import type { ICategory } from '../../../interfaces';

type Props = {
  value: ICategory['status'];
};

export const CategoryStatus = ({ value }: Props) => {
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
        {t(`categories.fields.status.${value}`)}
      </Typography.Text>
    </Tag>
  );
};
