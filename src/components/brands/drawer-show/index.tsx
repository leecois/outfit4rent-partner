import { EditOutlined } from '@ant-design/icons';
import { DeleteButton } from '@refinedev/antd';
import type { BaseKey, HttpError } from '@refinedev/core';
import {
  useGetToPath,
  useGo,
  useNavigation,
  useShow,
  useTranslate,
} from '@refinedev/core';
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  List,
  theme,
  Typography,
} from 'antd';
import { useSearchParams } from 'react-router-dom';

import type { IBrand } from '../../../interfaces';
import { Drawer } from '../../drawer';
import { BrandStatus } from '../status';

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const BrandDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<IBrand, HttpError>({
    resource: 'brands',
    id: props?.id, // when undefined, id will be read from the URL.
  });
  const brand = queryResult.data?.data;

  const handleDrawerClose = () => {
    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to:
        searchParameters.get('to') ??
        getToPath({
          action: 'list',
        }) ??
        '',
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: 'replace',
    });
  };

  return (
    <Drawer
      open={true}
      width={breakpoint.sm ? '378px' : '100%'}
      zIndex={1001}
      onClose={handleDrawerClose}
    >
      <Flex vertical align="center" justify="center">
        <Avatar
          shape="square"
          style={{
            aspectRatio: 1,
            objectFit: 'contain',
            width: '240px',
            height: '240px',
            margin: '16px auto',
            borderRadius: '8px',
          }}
          src={brand?.url}
          alt={brand?.url}
        />
      </Flex>

      <Flex
        vertical
        style={{
          backgroundColor: token.colorBgContainer,
        }}
      >
        <div
          style={{
            padding: '16px',
          }}
        >
          <Typography.Title level={5}>{brand?.name}</Typography.Title>
          <Typography.Text type="secondary">
            {brand?.description}
          </Typography.Text>
        </div>
        <Divider
          style={{
            margin: 0,
            padding: 0,
          }}
        />
        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">
                  {t('brands.fields.status.label')}
                </Typography.Text>
              ),
              value: <BrandStatus value={brand?.status ?? 0} />,
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t('brands.fields.isFeatured.label')}
                </Typography.Text>
              ),
              value: (
                <Typography.Text>
                  {brand?.isFeatured
                    ? t('brands.fields.isFeatured.true')
                    : t('brands.fields.isFeatured.false')}
                </Typography.Text>
              ),
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                style={{
                  padding: '0 16px',
                }}
                avatar={item.label}
                title={item.value}
              />
            </List.Item>
          )}
        />
      </Flex>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 16px 16px 0',
        }}
      >
        <DeleteButton
          type="text"
          recordItemId={brand?.id}
          resource="brands"
          onSuccess={handleDrawerClose}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              props.onEdit();
            } else {
              go({
                to: `${editUrl('brands', brand?.id || '')}`,
                query: {
                  to: '/brands',
                },
                options: {
                  keepQuery: true,
                },
                type: 'replace',
              });
            }
          }}
        >
          {t('actions.edit')}
        </Button>
      </div>
    </Drawer>
  );
};
