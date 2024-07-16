import type { AuthProps } from '@refinedev/antd';
import { AuthPage as AntdAuthPage } from '@refinedev/antd';

const authWrapperProps = {
  style: {
    background:
      "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('images/logo-text.svg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  },
};

const renderAuthContent = (content: React.ReactNode) => {
  return (
    <div
      style={{
        maxWidth: 408,
        margin: 'auto',
      }}
    >
      {content}
    </div>
  );
};

export const AuthPage: React.FC<AuthProps> = ({ type, formProps }) => {
  return (
    <AntdAuthPage
      type={type}
      registerLink={false}
      forgotPasswordLink={false}
      rememberMe={false}
      wrapperProps={authWrapperProps}
      renderContent={renderAuthContent}
      formProps={formProps}
    />
  );
};
