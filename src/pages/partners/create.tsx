import { LeftOutlined } from '@ant-design/icons';
import { ListButton } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Divider, Flex } from 'antd';

import { PartnerForm } from '../../components';

export const PartnerCreate = () => {
  const t = useTranslate();

  return (
    <>
      <Flex>
        <ListButton icon={<LeftOutlined />}>
          {t('partners.partners')}
        </ListButton>
      </Flex>
      <Divider />
      <PartnerForm action="create" />
    </>
  );
};
