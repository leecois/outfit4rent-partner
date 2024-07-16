import { CheckCircleOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import { Button, theme } from 'antd';

import { useConfigProvider } from '../context';

type Props = {} & ButtonProps;

export const ButtonSuccess = ({
  style,
  disabled,
  children,
  ...props
}: Props) => {
  const { token } = theme.useToken();
  const { mode } = useConfigProvider();

  let color;
  if (disabled) {
    color = undefined;
  } else {
    color = mode === 'dark' ? token.green7 : token.green8;
  }

  return (
    <Button
      type="default"
      disabled={disabled}
      icon={<CheckCircleOutlined />}
      style={{
        color,
        borderColor: disabled ? undefined : token.green4,
        ...style,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
