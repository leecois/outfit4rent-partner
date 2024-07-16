import { LeftOutlined } from '@ant-design/icons';
import { ListButton } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Divider, Flex } from 'antd';

import { PackageForm } from '../../components/packages/packageForm';

export const PackagesEdit = () => {
  const t = useTranslate();

  return (
    <>
      <Flex>
        <ListButton icon={<LeftOutlined />}>
          {t('packages.packages')}
        </ListButton>
      </Flex>
      <Divider />
      <PackageForm action="edit" />
    </>
  );
};
