import { EyeOutlined } from '@ant-design/icons';
import { List, useTable } from '@refinedev/antd';
import type { HttpError } from '@refinedev/core';
import { useGo, useNavigation, useTranslate } from '@refinedev/core';
import { Avatar, Button, Table, Tag } from 'antd';
import type { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import {
  CategoryStatus,
  PaginationTotal,
  TableCategoryProductColumn,
} from '../../components';
import type { ICategory } from '../../interfaces';

export const CategoryList = ({ children }: PropsWithChildren) => {
  const { tableProps } = useTable<ICategory, HttpError>();

  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  return (
    <List>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{
          x: true,
        }}
        pagination={{
          ...tableProps.pagination,
          hideOnSinglePage: true,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="categories" />
          ),
        }}
      >
        <Table.Column<ICategory>
          key="url"
          dataIndex="url"
          width={100}
          title={t('categories.fields.image')}
          render={(url: string) => {
            return <Avatar shape="square" src={url} alt="Category Image" />;
          }}
        />
        <Table.Column
          key="name"
          dataIndex="name"
          width={224}
          title={t('categories.fields.title')}
        />
        <Table.Column<ICategory>
          key="id"
          dataIndex="id"
          width={576}
          title={t('categories.fields.products')}
          render={(_, record) => {
            return <TableCategoryProductColumn category={record} />;
          }}
        />
        <Table.Column<ICategory>
          key="isFeatured"
          dataIndex="isFeatured"
          title={t('categories.fields.isFeatured.label')}
          render={(isFeatured) => (
            <Tag color={isFeatured ? 'green' : 'volcano'}>
              {isFeatured
                ? t('categories.fields.isFeatured.1')
                : t('categories.fields.isFeatured.0')}
            </Tag>
          )}
        />
        <Table.Column<ICategory>
          key="status"
          dataIndex="status"
          title={t('categories.fields.status.label')}
          render={(_, record) => {
            return <CategoryStatus value={record.status} />;
          }}
        />
        <Table.Column
          title={t('table.actions')}
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: ICategory) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                return go({
                  to: `${showUrl('categories', record.id)}`,
                  query: { to: pathname },
                  options: { keepQuery: true },
                  type: 'replace',
                });
              }}
            />
          )}
        />
      </Table>
      {children}
    </List>
  );
};
