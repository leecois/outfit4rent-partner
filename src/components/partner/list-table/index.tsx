import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import {
  EditButton,
  FilterDropdown,
  getDefaultSortOrder,
  useTable,
} from '@refinedev/antd';
import { getDefaultFilter, useTranslate } from '@refinedev/core';
import { Input, InputNumber, Select, Table, theme, Typography } from 'antd';

import type { IPartner } from '../../../interfaces';
import { PaginationTotal, PartnerStatus } from '../..';

export const PartnerListTable = () => {
  const { token } = theme.useToken();
  const t = useTranslate();

  const { tableProps, sorters, filters } = useTable<IPartner>({
    filters: {
      initial: [
        {
          field: 'name',
          operator: 'contains',
          value: '',
        },
        {
          field: 'email',
          operator: 'contains',
          value: '',
        },
      ],
    },
  });

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{
        x: true,
      }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="partners" />
        ),
      }}
    >
      <Table.Column
        dataIndex="id"
        width={80}
        title={
          <Typography.Text
            style={{
              whiteSpace: 'nowrap',
            }}
          >
            ID #
          </Typography.Text>
        }
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
              placeholder={t('partners.filter.id.placeholder')}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        dataIndex="name"
        title={t('partners.fields.name')}
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
            <Input placeholder={t('partners.filter.name.placeholder')} />
          </FilterDropdown>
        )}
      />
      <Table.Column
        dataIndex="email"
        title={t('partners.fields.email')}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter('email', filters, 'contains')}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t('partners.filter.email.placeholder')} />
          </FilterDropdown>
        )}
      />
      <Table.Column
        dataIndex="phone"
        title={t('partners.fields.phone')}
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
      <Table.Column dataIndex="address" title={t('partners.fields.address')} />
      <Table.Column
        title={t('partners.fields.area')}
        dataIndex={['area', 'address']}
        render={(_, record: IPartner) =>
          `${record.area.address}, ${record.area.district}, ${record.area.city}`
        }
      />

      <Table.Column
        dataIndex="status"
        title={t('partners.fields.status.label')}
        sorter
        defaultSortOrder={getDefaultSortOrder('status', sorters)}
        defaultFilteredValue={getDefaultFilter('status', filters, 'in')}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: '200px' }}
              allowClear
              mode="multiple"
              placeholder={t('partners.filter.status.placeholder')}
            >
              <Select.Option value="0">
                {t('partners.fields.status.inactive')}
              </Select.Option>
              <Select.Option value="1">
                {t('partners.fields.status.active')}
              </Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => <PartnerStatus value={value} />}
      />
      <Table.Column<IPartner>
        fixed="right"
        title={t('table.actions')}
        dataIndex="actions"
        key="actions"
        align="center"
        render={(_, record) => (
          <EditButton
            icon={<EyeOutlined />}
            recordItemId={record.id}
            hideText
          />
        )}
      />
    </Table>
  );
};
