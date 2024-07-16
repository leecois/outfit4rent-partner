import type { FormItemProps } from 'antd';
import { Form } from 'antd';
import type { PropsWithChildren } from 'react';

import { useStyles } from './styled';

type Props = {
  formItemProps?: FormItemProps;
  variant?: 'default' | 'title';
};

export const FormItemEditable = ({
  formItemProps,
  children,
  variant = 'title',
}: PropsWithChildren<Props>) => {
  const { styles, cx } = useStyles();

  return (
    <Form.Item
      {...formItemProps}
      className={cx(styles.formItem, styles[variant])}
    >
      {children}
    </Form.Item>
  );
};
