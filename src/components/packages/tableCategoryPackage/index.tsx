import { useTranslate } from '@refinedev/core';
import { Avatar, Table, Tag } from 'antd';

import type { ICategory, ICategoryPackage } from '../../../interfaces';

type Props = {
  categoryPackageWithCategory: Array<{
    categoryPackage: ICategoryPackage;
    category: ICategory;
  }>;
};

export const TableCategoryPackage = ({
  categoryPackageWithCategory,
}: Props) => {
  const t = useTranslate();

  return (
    <Table
      dataSource={categoryPackageWithCategory}
      rowKey="categoryPackage.id"
      scroll={{ x: 400, y: 700 }} // Adjust the y value to fit your needs
    >
      <Table.Column
        title={t('categories.fields.id')}
        dataIndex={['category', 'id']}
      />
      <Table.Column<ICategory>
        title={t('categories.fields.name')}
        dataIndex={['category', 'name']}
      />
      <Table.Column
        title={t('categories.fields.image')}
        dataIndex={['category', 'url']}
        render={(value) => <Avatar src={value} alt={value} />}
      />
      <Table.Column
        title={t('categories.fields.description')}
        dataIndex={['category', 'description']}
      />
      <Table.Column
        title={t('categories.maxAvailableQuantity')}
        dataIndex={['categoryPackage', 'maxAvailableQuantity']}
      />
      <Table.Column
        title={t('categories.fields.status.label')}
        dataIndex={['category', 'status']}
        render={(status: number) => (
          <Tag color={status === 0 ? 'red' : 'green'}>
            {status === 0 ? 'Inactive' : 'Active'}
          </Tag>
        )}
      />
    </Table>
  );
};
