import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { List } from '@refinedev/antd';
import { useNavigation } from '@refinedev/core';
import { Segmented } from 'antd';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { ProductListCard, ProductListTable } from '../../components/product';

type View = 'table' | 'card';

export const ProductList = ({ children }: PropsWithChildren) => {
  const { replace } = useNavigation();

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

  return (
    <List
      breadcrumb={false}
      headerButtons={() => [
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
      ]}
    >
      {view === 'table' && <ProductListTable />}
      {view === 'card' && <ProductListCard />}
      {children}
    </List>
  );
};
