import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ExportButton,
  FilterDropdown,
  getDefaultSortOrder,
  List,
  useTable,
} from '@refinedev/antd';
import type { HttpError } from '@refinedev/core';
import {
  getDefaultFilter,
  useExport,
  useGo,
  useNavigation,
  useTranslate,
} from '@refinedev/core';
import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Select,
  Table,
  theme,
  Typography,
} from 'antd';
import type { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { PaginationTotal, UserStatus } from '../../components';
import type { IUser, IUserFilterVariables } from '../../interfaces';

export const CustomerList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();

  const { tableProps, filters, sorters } = useTable<
    IUser,
    HttpError,
    IUserFilterVariables
  >({
    filters: {
      initial: [
        {
          field: 'name',
          operator: 'contains',
          value: '',
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: 'id',
          order: 'desc',
        },
      ],
    },
    syncWithLocation: true,
  });

  const { isLoading, triggerExport } = useExport<IUser>({
    sorters,
    filters,
    pageSize: 50,
    maxItemCount: 50,
    mapData: (item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      status: item.status,
    }),
  });

  return (
    <List
      breadcrumb={false}
      headerProps={{
        extra: <ExportButton onClick={triggerExport} loading={isLoading} />,
      }}
    >
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="users" />
          ),
        }}
      >
        <Table.Column
          key="id"
          dataIndex="id"
          title="ID #"
          render={(value) => (
            <Typography.Text style={{ whiteSpace: 'nowrap' }}>
              #{value}
            </Typography.Text>
          )}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          defaultFilteredValue={getDefaultFilter('id', filters, 'eq')}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <InputNumber
                addonBefore="#"
                style={{ width: '100%' }}
                placeholder={t('users.filter.id.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          align="center"
          key="picture"
          dataIndex="picture"
          title={t('users.fields.picture')}
          render={(value) => <Avatar src={value} />}
        />
        <Table.Column
          key="name"
          dataIndex="name"
          title={t('users.fields.name')}
          defaultFilteredValue={getDefaultFilter('name', filters, 'contains')}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                style={{ width: '100%' }}
                placeholder={t('users.filter.name.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          key="email"
          dataIndex="email"
          title={t('users.fields.email')}
          defaultFilteredValue={getDefaultFilter('email', filters, 'contains')}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                style={{ width: '100%' }}
                placeholder={t('users.filter.email.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          key="phone"
          dataIndex="phone"
          title={t('users.fields.phone')}
          defaultFilteredValue={getDefaultFilter('phone', filters, 'eq')}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                style={{ width: '100%' }}
                placeholder={t('users.filter.phone.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          key="address"
          dataIndex="address"
          title={t('users.fields.address')}
          defaultFilteredValue={getDefaultFilter(
            'address',
            filters,
            'contains',
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                style={{ width: '100%' }}
                placeholder={t('users.filter.address.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          key="status"
          dataIndex="status"
          title={t('users.fields.status.title')}
          render={(value) => <UserStatus value={value} />}
          sorter
          defaultSortOrder={getDefaultSortOrder('status', sorters)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: '100%' }}
                placeholder={t('users.filter.status.placeholder')}
              >
                <Select.Option value={1}>
                  {t('users.fields.status.active')}
                </Select.Option>
                <Select.Option value={0}>
                  {t('users.fields.status.inactive')}
                </Select.Option>
              </Select>
            </FilterDropdown>
          )}
        />
        <Table.Column<IUser>
          fixed="right"
          title={t('table.actions')}
          render={(_, record) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                return go({
                  to: `${showUrl('customers', record.id)}`,
                  query: {
                    to: pathname,
                  },
                  options: {
                    keepQuery: true,
                  },
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
