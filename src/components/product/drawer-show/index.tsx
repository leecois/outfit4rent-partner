import { ImageField, NumberField } from '@refinedev/antd';
import type { BaseKey, HttpError } from '@refinedev/core';
import {
  useGetToPath,
  useGo,
  useOne,
  useShow,
  useTranslate,
} from '@refinedev/core';
import { Col, Divider, Grid, List, Row, theme, Typography } from 'antd';
import { useSearchParams } from 'react-router-dom';

import type { IBrand, ICategory, IProductList } from '../../../interfaces';
import { Drawer } from '../../drawer';
import { ProductStatus } from '../status';

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const ProductDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<IProductList, HttpError>({
    resource: 'products',
    id: props?.id, // when undefined, id will be read from the URL.
  });
  const product = queryResult.data?.data;

  const { data: categoryData } = useOne<ICategory, HttpError>({
    resource: 'categories',
    id: product?.idCategory,
    queryOptions: {
      enabled: !!product?.idCategory,
    },
  });
  const { data: brandData } = useOne<IBrand, HttpError>({
    resource: 'brands',
    id: product?.idBrand,
    queryOptions: {
      enabled: !!product?.idBrand,
    },
  });
  const category = categoryData?.data;
  const brand = brandData?.data;

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
      width={breakpoint.sm ? '736px' : '100%'}
      zIndex={1001}
      onClose={handleDrawerClose}
    >
      <div
        style={{
          padding: '16px',
          backgroundColor: token.colorBgContainer,
        }}
      >
        <Typography.Title level={5}>{product?.name}</Typography.Title>
        <Typography.Text type="secondary">
          {product?.description}
        </Typography.Text>
      </div>
      <Divider style={{ margin: 0, padding: 0 }} />
      <Row gutter={[16, 16]} style={{ padding: '16px' }}>
        {product?.images?.map((image) => (
          <Col
            key={image.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ImageField
              value={image.url}
              alt={`Product image ${image.id}`}
              style={{
                aspectRatio: 1,
                objectFit: 'contain',
                width: '100%',
                maxHeight: '200px',
              }}
            />
          </Col>
        ))}
      </Row>

      <div style={{ backgroundColor: token.colorBgContainer }}>
        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">
                  {t('products.fields.price')}
                </Typography.Text>
              ),
              value: (
                <NumberField
                  value={product?.price || 0}
                  options={{
                    style: 'currency',
                    currency: 'USD',
                  }}
                />
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t('products.fields.category')}
                </Typography.Text>
              ),
              value: <Typography.Text>{category?.name}</Typography.Text>,
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t('products.fields.brand')}
                </Typography.Text>
              ),
              value: <Typography.Text>{brand?.name}</Typography.Text>,
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {t('products.fields.status.label')}
                </Typography.Text>
              ),
              value: <ProductStatus value={product?.status ?? 0} />,
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                style={{ padding: '0 16px' }}
                avatar={item.label}
                title={item.value}
              />
            </List.Item>
          )}
        />
      </div>
    </Drawer>
  );
};
