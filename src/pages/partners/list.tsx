// PartnerList.tsx
import { EnvironmentOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { CreateButton, List } from '@refinedev/antd';
import { useTranslate } from '@refinedev/core';
import { Flex, Segmented } from 'antd';
import { useState } from 'react';

import { AllPartnersMap, PartnerListTable } from '../../components';

type View = 'table' | 'map';

export const PartnerList = () => {
  const [view, setView] = useState<View>(
    (localStorage.getItem('partner-view') as View) || 'table',
  );

  const handleViewChange = (value: View) => {
    setView(value);
    localStorage.setItem('partner-view', value);
  };

  const t = useTranslate();

  return (
    <>
      <List
        breadcrumb={false}
        headerButtons={(props) => [
          <Segmented<View>
            key="view"
            size="large"
            value={view}
            style={{ marginRight: 24 }}
            options={[
              {
                label: '',
                value: 'table',
                icon: <UnorderedListOutlined />,
              },
              {
                label: '',
                value: 'map',
                icon: <EnvironmentOutlined />,
              },
            ]}
            onChange={handleViewChange}
          />,
          <CreateButton {...props.createButtonProps} key="create" size="large">
            {t('partners.addNewPartner')}
          </CreateButton>,
        ]}
      >
        {view === 'table' && <PartnerListTable />}
        {view === 'map' && (
          <Flex
            style={{
              height: 'calc(100dvh - 232px)',
              marginTop: '32px',
            }}
          >
            <AllPartnersMap />
          </Flex>
        )}
      </List>
    </>
  );
};
