import { useGetToPath, useGo } from '@refinedev/core';
import { useSearchParams } from 'react-router-dom';

import { BrandDrawerForm } from '../../components/brands/drawer-form';

export const BrandCreate = () => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();

  return (
    <BrandDrawerForm
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
