import { SearchOutlined } from '@ant-design/icons';
import {
  DateField,
  ExportButton,
  FilterDropdown,
  getDefaultSortOrder,
  List,
  NumberField,
  useTable,
} from '@refinedev/antd';
import type { HttpError } from '@refinedev/core';
import {
  getDefaultFilter,
  useExport,
  useNavigation,
  useTranslate,
} from '@refinedev/core';
import { Input, InputNumber, Select, Table, theme, Typography } from 'antd';
import { useState } from 'react';

import { OrderActions, OrderStatus, PaginationTotal } from '../../components';
import type { IOrder } from '../../interfaces';

export const OrderList = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const { show } = useNavigation();

  const [reload, setReload] = useState(false); // State to trigger re-fetch

  const { tableProps, sorters, filters } = useTable<IOrder, HttpError>({
    resource: 'orders',
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
    syncWithLocation: true, // Ensure filters and sorting sync with URL location
    queryOptions: {
      retry: false, // Disable retries on failed queries
      refetchOnWindowFocus: false, // Do not refetch data on window focus
    },
    meta: {
      key: reload ? 'reload' : 'default', // Use reload state to trigger refetch
    },
  });

  const { isLoading, triggerExport } = useExport<IOrder>({
    sorters,
    filters,
    pageSize: 50,
    maxItemCount: 50,
    mapData: (item) => {
      return {
        id: item.id,
        customerId: item.customerId,
        packageId: item.packageId,
        packageName: item.packageName,
        dateFrom: item.dateFrom,
        dateTo: item.dateTo,
        price: item.price,
        receiverName: item.receiverName,
        receiverPhone: item.receiverPhone,
        receiverAddress: item.receiverAddress,
        status: item.status,
        transactionId: item.transactionId,
        quantityOfItems: item.quantityOfItems,
        totalDeposit: item.totalDeposit,
      };
    },
  });

  const refreshTable = () => {
    setReload((prev) => !prev); // Toggle reload state to trigger refetch
  };

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
              show('orders', record.id);
            },
          };
        }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="orders" />
          ),
        }}
      >
        <Table.Column
          key="id"
          dataIndex="id"
          title={t('orders.fields.id')}
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
        <Table.Column<IOrder>
          key="status"
          dataIndex="status"
          title={t('orders.fields.status')}
          render={(_, record) => {
            return <OrderStatus status={record.status} />;
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
                  { label: t('enum.orderStatuses.0'), value: 0 },
                  { label: t('enum.orderStatuses.1'), value: 1 },
                  { label: t('enum.orderStatuses.2'), value: 2 },
                  { label: t('enum.orderStatuses.-1'), value: -1 },
                ]}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IOrder>
          align="right"
          key="totalDeposit"
          dataIndex="totalDeposit"
          title={t('orders.fields.totalDeposit')}
          defaultSortOrder={getDefaultSortOrder('totalDeposit', sorters)}
          sorter
          defaultFilteredValue={getDefaultFilter('totalDeposit', filters, 'eq')}
          render={(value) => {
            return (
              <NumberField
                options={{
                  currency: 'USD',
                  style: 'currency',
                }}
                value={value / 100}
              />
            );
          }}
        />
        <Table.Column<IOrder>
          align="right"
          key="quantityOfItems"
          dataIndex="quantityOfItems"
          title={t('orders.fields.quantityOfItems')}
          defaultSortOrder={getDefaultSortOrder('quantityOfItems', sorters)}
          sorter
          defaultFilteredValue={getDefaultFilter(
            'quantityOfItems',
            filters,
            'eq',
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
              <InputNumber
                addonBefore="#"
                style={{ width: '100%' }}
                placeholder={t('orders.filter.id.placeholder')}
              />
            </FilterDropdown>
          )}
          render={(value) => {
            return <NumberField value={value} />;
          }}
        />
        <Table.Column
          align="right"
          key="receiverName"
          dataIndex="receiverName"
          title={t('orders.fields.receiverName')}
          defaultSortOrder={getDefaultSortOrder('receiverName', sorters)}
          defaultFilteredValue={getDefaultFilter(
            'receiverName',
            filters,
            'contains',
          )}
          sorter
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
                placeholder={t('orders.filter.id.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IOrder>
          align="right"
          key="receiverPhone"
          dataIndex="receiverPhone"
          title={t('orders.fields.receiverPhone')}
          defaultSortOrder={getDefaultSortOrder('receiverPhone', sorters)}
          defaultFilteredValue={getDefaultFilter(
            'receiverPhone',
            filters,
            'contains',
          )}
          sorter
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
                placeholder={t('orders.filter.id.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          align="right"
          key="receiverAddress"
          dataIndex="receiverAddress"
          title={t('orders.fields.receiverAddress')}
          defaultSortOrder={getDefaultSortOrder('receiverAddress', sorters)}
          defaultFilteredValue={getDefaultFilter(
            'receiverAddress',
            filters,
            'contains',
          )}
          sorter
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
                placeholder={t('orders.filter.id.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IOrder>
          key="dateFrom"
          dataIndex="dateFrom"
          title={t('orders.fields.dateFrom')}
          render={(value) => <DateField value={value} format="LLL" />}
          sorter
          defaultFilteredValue={getDefaultFilter('dateFrom', filters, 'gte')}
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
                placeholder={t('orders.filter.id.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IOrder>
          key="dateTo"
          dataIndex="dateTo"
          title={t('orders.fields.dateTo')}
          render={(value) => <DateField value={value} format="LLL" />}
          sorter
          defaultSortOrder={getDefaultSortOrder('dateTo', sorters)}
          defaultFilteredValue={getDefaultFilter('dateTo', filters, 'lte')}
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
                placeholder={t('orders.filter.id.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IOrder>
          align="right"
          key="packageName"
          dataIndex="packageName"
          title={t('orders.fields.packageName')}
          defaultSortOrder={getDefaultSortOrder('packageName', sorters)}
          defaultFilteredValue={getDefaultFilter(
            'packageName',
            filters,
            'contains',
          )}
          sorter
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
                placeholder={t('orders.filter.id.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IOrder>
          align="right"
          key="customerId"
          dataIndex="customerId"
          title={t('orders.fields.customerId')}
          defaultSortOrder={getDefaultSortOrder('customerId', sorters)}
          sorter
          defaultFilteredValue={getDefaultFilter('customerId', filters, 'eq')}
          render={(value) => {
            return <NumberField value={value} />;
          }}
        />
        <Table.Column<IOrder>
          key="createdAt"
          dataIndex="createdAt"
          title={t('orders.fields.createdAt')}
          render={(value) => <DateField value={value} format="LLL" />}
          sorter
          defaultFilteredValue={getDefaultFilter('createdAt', filters, 'gte')}
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
                placeholder={t('orders.filter.id.placeholder')}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IOrder>
          key="actions"
          title={t('table.actions')}
          dataIndex="actions"
          render={(_, record) => (
            <OrderActions record={record} onStatusUpdated={refreshTable} />
          )}
        />
      </Table>
    </List>
  );
};
