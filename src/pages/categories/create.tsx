import { useGetToPath, useGo } from '@refinedev/core';
import { useSearchParams } from 'react-router-dom';

import { CategoryDrawerForm } from '../../components/categories/drawer-form';

export const CategoryCreate = () => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();

  return (
    <CategoryDrawerForm
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
