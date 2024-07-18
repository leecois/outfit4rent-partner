import { DownOutlined } from '@ant-design/icons';
import { useGetIdentity, useGetLocale, useSetLocale } from '@refinedev/core';
import type { MenuProps } from 'antd';
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Grid,
  Layout as AntdLayout,
  Row,
  Space,
  theme,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';

import { useConfigProvider } from '../../context';
import type { IIdentity } from '../../interfaces';
import { IconMoon, IconSun } from '../icons';
import { useStyles } from './styled';

const { Header: AntdHeader } = AntdLayout;
const { useToken } = theme;
const { Text } = Typography;
const { useBreakpoint } = Grid;

export const Header: React.FC = () => {
  const { token } = useToken();
  const { styles } = useStyles();
  const { mode, setMode } = useConfigProvider();
  const { i18n } = useTranslation();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { data: user } = useGetIdentity<IIdentity>();
  const screens = useBreakpoint();

  const currentLocale = locale();

  // const { refetch: refetchOrders } = useList<IOrder>({
  //   resource: 'orders',
  //   config: {
  //     filters: [{ field: 'q', operator: 'contains', value }],
  //   },
  //   queryOptions: {
  //     enabled: false,
  //     onSuccess: (data) => {
  //       const orderOptionGroup = data.data.map((item) =>
  //         renderItem(
  //           `${item.store.title} / #${item.orderNumber}`,
  //           item?.products?.[0].images?.[0]?.url ||
  //             '/images/default-order-img.png',
  //           `/orders/${item.id}`,
  //         ),
  //       );
  //       if (orderOptionGroup.length > 0) {
  //         setOptions((previousOptions) => [
  //           ...previousOptions,
  //           {
  //             label: renderTitle(t('orders.orders')),
  //             options: orderOptionGroup,
  //           },
  //         ]);
  //       }
  //     },
  //   },
  // });

  // const { refetch: refetchPartners } = useList<IPartner>({
  //   resource: 'partners',
  //   config: {
  //     filters: [{ field: 'q', operator: 'contains', value }],
  //   },
  //   queryOptions: {
  //     enabled: false,
  //     onSuccess: (data) => {
  //       const storeOptionGroup = data.data.map((item) =>
  //         renderItem(item.title, '', `/partners/${item.id}/edit`),
  //       );
  //       if (storeOptionGroup.length > 0) {
  //         setOptions((previousOptions) => [
  //           ...previousOptions,
  //           {
  //             label: renderTitle(t('stores.stores')),
  //             options: storeOptionGroup,
  //           },
  //         ]);
  //       }
  //     },
  //   },
  // });

  const menuItems: MenuProps['items'] = [...(i18n.languages || [])]
    .sort()
    .map((lang: string) => ({
      key: lang,
      onClick: () => changeLanguage(lang),
      icon: (
        <span style={{ marginRight: 8 }}>
          <Avatar size={16} src={`/images/flags/${lang}.svg`} />
        </span>
      ),
      label: lang === 'en' ? 'English' : 'Vietnam',
    }));

  return (
    <AntdHeader
      style={{
        backgroundColor: token.colorBgElevated,
        padding: '0 24px',
      }}
    >
      <Row
        align="middle"
        style={{
          justifyContent: screens.sm ? 'space-between' : 'end',
        }}
      >
        <Col xs={0} sm={8} md={12}></Col>
        <Col>
          <Space size={screens.md ? 32 : 16} align="center">
            <Dropdown
              menu={{
                items: menuItems,
                selectedKeys: currentLocale ? [currentLocale] : [],
              }}
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Space>
                  <Text className={styles.languageSwitchText}>
                    {currentLocale === 'en' ? 'English' : 'Vietnam'}
                  </Text>
                  <DownOutlined className={styles.languageSwitchIcon} />
                </Space>
              </Button>
            </Dropdown>

            <Button
              className={styles.themeSwitch}
              type="text"
              icon={mode === 'light' ? <IconMoon /> : <IconSun />}
              onClick={() => {
                setMode(mode === 'light' ? 'dark' : 'light');
              }}
            />

            <Space size={screens.md ? 16 : 8} align="center">
              <Text ellipsis className={styles.userName}>
                {user?.name}
              </Text>
              <Avatar size="large" src={user?.avatar} alt={user?.name} />
            </Space>
          </Space>
        </Col>
      </Row>
    </AntdHeader>
  );
};
