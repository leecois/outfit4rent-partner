import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { CreateButton, List } from '@refinedev/antd';
import { useGo, useNavigation, useTranslate } from '@refinedev/core';
import { Segmented } from 'antd';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ProductListCard, ProductListTable } from '../../components';

type View = 'table' | 'card';

export const ProductList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const [view, setView] = useState<View>('table');

  // Ensure localStorage is accessed only on the client side
  useEffect(() => {
    const savedView = localStorage.getItem('product-view') as View;
    if (savedView) {
      setView(savedView);
    }
  }, []);

  const handleViewChange = (value: string | View) => {
    if (value === 'table' || value === 'card') {
      // remove query params (pagination, filters, etc.) when changing view
      replace('');

      setView(value);
      localStorage.setItem('product-view', value);
    } else {
      // eslint-disable-next-line no-console
      console.error('Unexpected view value:', value);
    }
  };

  const t = useTranslate();

  return (
    <List
      breadcrumb={false}
      headerButtons={(props) => [
        <Segmented<View>
          key="view"
          size="large"
          value={view}
          style={{ marginRight: 24 }}
          options={[
            {
              label: '',
              value: 'table',
              icon: <UnorderedListOutlined />,
            },
            {
              label: '',
              value: 'card',
              icon: <AppstoreOutlined />,
            },
          ]}
          onChange={handleViewChange}
        />,
        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl('products')}`,
              query: {
                to: pathname,
              },
              options: {
                keepQuery: true,
              },
              type: 'replace',
            });
          }}
        >
          {t('products.actions.add')}
        </CreateButton>,
      ]}
    >
      {view === 'table' && <ProductListTable />}
      {view === 'card' && <ProductListCard />}
      {children}
    </List>
  );
};
