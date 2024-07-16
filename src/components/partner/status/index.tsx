import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Tag, theme, Typography } from 'antd';

import { useConfigProvider } from '../../../context';
import type { IPartner } from '../../../interfaces';

type Props = {
  value: IPartner['status'];
};

export const PartnerStatus = ({ value }: Props) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const { mode } = useConfigProvider();
  const isDark = mode === 'dark';

  let color;
  if (value) {
    color = isDark ? token.colorSuccess : '#3C8618';
  } else {
    color = token.colorTextTertiary;
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
        {t(`partners.fields.status.${value}`)}
      </Typography.Text>
    </Tag>
  );
};
