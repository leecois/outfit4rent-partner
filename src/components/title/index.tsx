import { useLink } from '@refinedev/core';
import { Space, theme } from 'antd';

import { O4RLogoIcon, O4RLogoText } from '..';
import { Logo } from './styled';

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { token } = theme.useToken();
  const Link = useLink();

  return (
    <Logo>
      <Link to="/">
        {collapsed ? (
          <O4RLogoIcon />
        ) : (
          <Space size={12}>
            <O4RLogoIcon
              style={{
                fontSize: '32px',
                color: token.colorTextHeading,
              }}
            />
            <O4RLogoText
              style={{
                color: token.colorTextHeading,
                width: '100%',
                height: 'auto',
              }}
            />
          </Space>
        )}
      </Link>
    </Logo>
  );
};
