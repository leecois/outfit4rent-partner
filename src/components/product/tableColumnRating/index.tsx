import { useList } from '@refinedev/core';
import { Rate } from 'antd';

import type { IProductList, IReview } from '../../../interfaces';

type Props = {
  product?: IProductList;
};

export const ProductTableColumnRating = (props: Props) => {
  const { data, isLoading } = useList<IReview>({
    resource: 'reviews',
    filters: [
      {
        field: 'order.product.id',
        operator: 'eq',
        value: props.product?.id,
      },
    ],
    pagination: {
      mode: 'off',
    },
    queryOptions: {
      enabled: !!props.product?.id,
    },
  });

  if (isLoading)
    return (
      <Rate
        key="skeleton"
        style={{
          minWidth: '132px',
        }}
        disabled
        allowHalf
        defaultValue={0}
      />
    );

  const review = data?.data || [];
  const totalStarCount = review?.reduce(
    (accumulator, current) => accumulator + (current?.numberStars || 0),
    0,
  );
  const avgStar = totalStarCount / (review?.length || 1);

  return (
    <Rate
      style={{
        minWidth: '132px',
      }}
      key="with-value"
      disabled
      allowHalf
      defaultValue={avgStar}
    />
  );
};
