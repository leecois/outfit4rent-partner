import { NumberField } from '@refinedev/antd';
import { Avatar, Flex, Table, Typography } from 'antd';

import type { IProductInReturnOrder } from '../../../interfaces';

type Props = {
  productsInReturnOrder: IProductInReturnOrder[];
  isLoading: boolean;
};

export const ReturnOrderProducts = ({
  productsInReturnOrder,
  isLoading,
}: Props) => {
  return (
    <Table
      dataSource={productsInReturnOrder}
      loading={isLoading}
      pagination={false}
      scroll={{ x: true }}
    >
      <Table.Column<IProductInReturnOrder> title="Id" dataIndex="id" key="id" />
      <Table.Column<IProductInReturnOrder>
        title="Product"
        dataIndex="name"
        key="name"
        render={(_, record) => {
          return (
            <Flex gap={16} align="center">
              <Avatar
                shape="square"
                src={record.product?.images[0]?.url || ''}
                alt={record.product.name}
              />
              <Typography.Text>{record.product.name}</Typography.Text>
            </Flex>
          );
        }}
      />
      <Table.Column<IProductInReturnOrder>
        align="end"
        title="Quantity"
        dataIndex="quantity"
        key="quantity"
      />

      <Table.Column<IProductInReturnOrder>
        align="end"
        title="Damaged Level"
        dataIndex="damagedLevel"
        key="damagedLevel"
        render={(value) => (
          <NumberField
            value={value || 0}
            options={{ style: 'currency', currency: 'USD' }}
          />
        )}
      />

      <Table.Column<IProductInReturnOrder>
        title="Thorn Money"
        dataIndex="thornMoney"
        align="end"
        key="thornMoney"
        render={(value) => (
          <NumberField
            value={value || 0}
            options={{ style: 'currency', currency: 'USD' }}
          />
        )}
      />
      <Table.Column<IProductInReturnOrder>
        title="Description"
        dataIndex="description"
        align="end"
        key="description"
      />
    </Table>
  );
};
