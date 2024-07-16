import { useTable } from '@refinedev/antd';
import { useNavigation, useTranslate } from '@refinedev/core';
import { Rate, Table, Tag } from 'antd';

import type { IProductList, IReview } from '../../../interfaces';

type Props = {
  product?: IProductList;
};

export const ProductReviewTable = (props: Props) => {
  const t = useTranslate();
  const { show } = useNavigation();

  const { tableProps } = useTable<IReview>({
    resource: 'reviews',
    filters: {
      permanent: [
        {
          field: 'order.product.id',
          value: props.product?.id,
          operator: 'eq',
        },
      ],
    },
    pagination: {
      mode: 'off',
    },
    queryOptions: {
      enabled: !!props.product,
    },
  });
  return (
    <Table {...tableProps} rowKey="id">
      <Table.Column title={t('reviews.reviews')} dataIndex="content" />
      <Table.Column
        title={t('reviews.fields.rating')}
        dataIndex="star"
        render={(value) => (
          <Rate
            style={{
              minWidth: '132px',
            }}
            disabled
            allowHalf
            value={value}
          />
        )}
      />
      <Table.Column
        title={t('reviews.fields.orderId')}
        dataIndex={['order', 'id']}
        render={(value) => (
          <Tag
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              show('orders', value);
            }}
          >
            #{value}
          </Tag>
        )}
      />
    </Table>
  );
};
