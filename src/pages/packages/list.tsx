import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import {
  CreateButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from '@refinedev/antd';
import {
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from '@refinedev/core';
import {
  Avatar,
  Input,
  InputNumber,
  Select,
  Table,
  theme,
  Typography,
} from 'antd';
import type { PropsWithChildren } from 'react';
import InputMask from 'react-input-mask';
import { useLocation } from 'react-router-dom';

import { PackageStatus, PaginationTotal } from '../../components';
import type { IPackage } from '../../interfaces';

export const PackagesList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();

  const { tableProps, filters } = useTable<IPackage>({
    filters: {
      initial: [
        {
          field: 'name',
          operator: 'contains',
          value: '',
        },
      ],
    },
  });

  return (
    <>
      <List
        breadcrumb={false}
        headerButtons={(props) => [
          <CreateButton
            {...props.createButtonProps}
            key="create"
            size="large"
            onClick={() => {
              return go({
                to: `${createUrl('packages')}`,
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
            {t('packages.actions.add')}
          </CreateButton>,
        ]}
      >
        <Table
          {...tableProps}
          rowKey="id"
          scroll={{ x: true }}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => (
              <PaginationTotal total={total} entityName="products" />
            ),
          }}
        >
          <Table.Column
            title={
              <Typography.Text
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                ID #
              </Typography.Text>
            }
            dataIndex="id"
            key="id"
            width={80}
            render={(value) => (
              <Typography.Text
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
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
                  placeholder={t('products.filter.id.placeholder')}
                />
              </FilterDropdown>
            )}
          />
          <Table.Column<IPackage>
            key="url"
            dataIndex="url"
            title={t('packages.fields.thumbnail.label')}
            render={(_, record) => (
              <Avatar src={record.url} alt={record.name} />
            )}
          />
          <Table.Column<IPackage>
            key="name"
            dataIndex="name"
            title={t('packages.fields.name.label')}
            filterIcon={(filtered) => (
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
            defaultFilteredValue={getDefaultFilter('name', filters, 'contains')}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder={t('packages.filter.name.placeholder')} />
              </FilterDropdown>
            )}
          />
          <Table.Column
            key="price"
            dataIndex="price"
            title={() => {
              return (
                <Typography.Text
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t('packages.fields.price.label')}
                </Typography.Text>
              );
            }}
            filterIcon={(filtered) => (
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
            defaultFilteredValue={getDefaultFilter(
              'price',
              filters,
              'contains',
            )}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder={t('packages.filter.price.placeholder')} />
              </FilterDropdown>
            )}
            render={(value) => (
              <Typography.Text
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                {value}
              </Typography.Text>
            )}
          />
          <Table.Column
            dataIndex="availableRentDays"
            key="availableRentDays"
            title={t('packages.fields.rentalPeriod.label')}
            filterIcon={(filtered) => (
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
            defaultFilteredValue={getDefaultFilter('gsm', filters, 'eq')}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <InputMask mask="(999) 999 99 99">
                  {/* 
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore */}
                  {(inputProps: InputProps) => <Input {...inputProps} />}
                </InputMask>
              </FilterDropdown>
            )}
            render={(value) => (
              <Typography.Text
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                {value}
              </Typography.Text>
            )}
          />
          <Table.Column<IPackage>
            dataIndex="numOfProduct"
            key="numOfProduct"
            title={t('packages.fields.numOfProduct.label')}
            render={(value) => (
              <Typography.Text
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                {value}
              </Typography.Text>
            )}
          />
          <Table.Column<IPackage>
            dataIndex="status"
            key="status"
            title={t('packages.fields.status.label')}
            sorter
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: '200px' }}
                  allowClear
                  mode="multiple"
                  placeholder={t('packages.filter.status.placeholder')}
                >
                  <Select.Option value="1">
                    {t('packages.fields.status.active')}
                  </Select.Option>
                  <Select.Option value="0">
                    {t('packages.fields.status.inactive')}
                  </Select.Option>
                </Select>
              </FilterDropdown>
            )}
            render={(_, record) => {
              return <PackageStatus value={record.status} />;
            }}
          />
          <Table.Column
            title={t('table.actions')}
            key="actions"
            fixed="right"
            align="center"
            render={(_, record: IPackage) => {
              return (
                <EditButton
                  icon={<EyeOutlined />}
                  hideText
                  recordItemId={record.id}
                />
              );
            }}
          />
        </Table>
      </List>
      {children}
    </>
  );
};
