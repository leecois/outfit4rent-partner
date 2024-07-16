import { useGetToPath, useGo } from '@refinedev/core';
import { useSearchParams } from 'react-router-dom';

import { ProductDrawerForm } from '../../components/product/drawer-form';

export const ProductCreate = () => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();

  return (
    <ProductDrawerForm
      action="create"
      onMutationSuccess={() => {
        go({
          to:
            searchParameters.get('to') ??
            getToPath({
              action: 'list',
            }) ??
            '',
          query: {
            to: undefined,
          },
          options: {
            keepQuery: true,
          },
          type: 'replace',
        });
      }}
    />
  );
};
