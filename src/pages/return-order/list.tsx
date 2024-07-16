import { SearchOutlined } from '@ant-design/icons';
import {
  DateField,
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
  useNavigation,
  useTranslate,
} from '@refinedev/core';
import { Input, Select, Table, theme, Typography } from 'antd';

import { PaginationTotal } from '../../components';
import { ReturnOrderStatus } from '../../components/return-orders/status';
import type { IReturnOrder } from '../../interfaces';

export const ReturnOrderList = () => {
  const { token } = theme.useToken();

  const { tableProps, sorters, filters } = useTable<IReturnOrder, HttpError>({
    resource: 'return-orders',
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {
      initial: [
        {
          field: 'receiverName',
          operator: 'contains',
          value: '',
        },
        {
          field: 'receiverPhone',
          operator: 'contains',
          value: '',
        },
        {
          field: 'receiverAddress',
          operator: 'contains',
          value: '',
        },
        {
          field: 'status',
          operator: 'eq',
          value: null,
        },
        {
          field: 'quantityOfItems',
          operator: 'eq',
          value: null,
        },
        {
          field: 'totalDeposit',
          operator: 'eq',
          value: null,
        },
        {
          field: 'dateFrom',
          operator: 'gte',
          value: null,
        },
        {
          field: 'dateTo',
          operator: 'lte',
          value: null,
        },
        {
          field: 'customerId',
          operator: 'eq',
          value: null,
        },
        {
          field: 'packageName',
          operator: 'contains',
          value: '',
        },
      ],
    },
  });

  const t = useTranslate();
  const { show } = useNavigation();

  const { isLoading, triggerExport } = useExport<IReturnOrder>({
    sorters,
    filters,
    pageSize: 50,
    maxItemCount: 50,
    mapData: (item) => {
      return {
        id: item.id,
        address: item.address,
        customerId: item.customerId,
        dateReturn: item.dateReturn,
        name: item.name,
        partnerId: item.partnerId,
        phone: item.phone,
        status: item.status,
      };
    },
  });

  return (
    <List
      headerProps={{
        extra: <ExportButton onClick={triggerExport} loading={isLoading} />,
      }}
    >
      <Table
        {...tableProps}
        rowKey="id"
        style={{
          cursor: 'pointer',
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              show('return-orders', record.id);
            },
          };
        }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="return-orders" />
          ),
        }}
      >
        <Table.Column
          key="id"
          dataIndex="id"
          title={t('return-orders.fields.id')}
          render={(value) => (
            <Typography.Text
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              #{value}
            </Typography.Text>
          )}
        />
        <Table.Column<IReturnOrder>
          key="status"
          dataIndex="status"
          title={t('return-orders.fields.status')}
          render={(_, record) => {
            return <ReturnOrderStatus status={record.status} />;
          }}
          sorter
          defaultSortOrder={getDefaultSortOrder('status', sorters)}
          defaultFilteredValue={getDefaultFilter('status', filters, 'eq')}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: '200px' }}
                allowClear
                mode="multiple"
                placeholder={t('orders.filter.status.placeholder')}
                options={[
                  { label: t('enum.return-order.status.0'), value: 0 },
                  { label: t('enum.return-order.status.1'), value: 1 },
                  { label: t('enum.return-order.status.2'), value: 2 },
                  { label: t('enum.return-order.status.-1'), value: -1 },
                ]}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IReturnOrder>
          align="right"
          key="name"
          dataIndex="name"
          title={t('return-orders.fields.name')}
          defaultSortOrder={getDefaultSortOrder('name', sorters)}
          sorter
          defaultFilteredValue={getDefaultFilter('name', filters, 'contains')}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                addonBefore="#"
                style={{ width: '100%' }}
                placeholder={t('orders.filter.name.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IReturnOrder>
          align="right"
          key="address"
          dataIndex="address"
          title={t('return-orders.fields.address')}
          defaultSortOrder={getDefaultSortOrder('address', sorters)}
          sorter
          defaultFilteredValue={getDefaultFilter(
            'address',
            filters,
            'contains',
          )}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                addonBefore="#"
                style={{ width: '100%' }}
                placeholder={t('orders.filter.address.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IReturnOrder>
          align="right"
          key="phone"
          dataIndex="phone"
          title={t('return-orders.fields.phone')}
          defaultSortOrder={getDefaultSortOrder('phone', sorters)}
          defaultFilteredValue={getDefaultFilter('phone', filters, 'contains')}
          sorter
        />
        <Table.Column<IReturnOrder>
          align="right"
          key="partnerId"
          dataIndex="partnerId"
          title={t('return-orders.fields.partnerId')}
          defaultSortOrder={getDefaultSortOrder('partnerId', sorters)}
          defaultFilteredValue={getDefaultFilter('partnerId', filters, 'eq')}
          sorter
        />
        <Table.Column<IReturnOrder>
          align="right"
          key="customerId"
          dataIndex="customerId"
          title={t('return-orders.fields.customerId')}
          defaultSortOrder={getDefaultSortOrder('customerId', sorters)}
          defaultFilteredValue={getDefaultFilter('customerId', filters, 'eq')}
          sorter
        />
        <Table.Column<IReturnOrder>
          align="right"
          key="customerPackageId"
          dataIndex="customerPackageId"
          title={t('return-orders.fields.orderId')}
          defaultSortOrder={getDefaultSortOrder('customerPackageId', sorters)}
          defaultFilteredValue={getDefaultFilter(
            'customerPackageId',
            filters,
            'eq',
          )}
          sorter
        />
        <Table.Column<IReturnOrder>
          key="dateReturn"
          dataIndex="dateReturn"
          title={t('return-orders.fields.dateReturn')}
          render={(value) => <DateField value={value} format="LLL" />}
          sorter
          defaultFilteredValue={getDefaultFilter('dateReturn', filters, 'gte')}
        />
        <Table.Column<IReturnOrder>
          key="quantityOfItems"
          dataIndex="quantityOfItems"
          title={t('return-orders.fields.quantityOfItems')}
          sorter
          defaultSortOrder={getDefaultSortOrder('quantityOfItems', sorters)}
          defaultFilteredValue={getDefaultFilter(
            'quantityOfItems',
            filters,
            'eq',
          )}
        />
        <Table.Column<IReturnOrder>
          key="totalThornMoney"
          dataIndex="totalThornMoney"
          title={t('return-orders.fields.totalThornMoney')}
          sorter
          defaultSortOrder={getDefaultSortOrder('totalThornMoney', sorters)}
          defaultFilteredValue={getDefaultFilter(
            'totalThornMoney',
            filters,
            'eq',
          )}
        />
      </Table>
    </List>
  );
};
