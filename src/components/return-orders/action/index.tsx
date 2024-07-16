import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useApiUrl, useTranslate } from '@refinedev/core';
import { Dropdown, Menu, message } from 'antd';

import type { IReturnOrder } from '../../../interfaces';
import { TableActionButton } from '../../tableActionButton';

type OrderActionProps = {
  record: IReturnOrder;
};

export const ReturnOrderActions: React.FC<OrderActionProps> = ({ record }) => {
  const t = useTranslate();
  const apiUrl = useApiUrl();

  const handleUpdateStatus = async (id: number, status: number) => {
    try {
      const response = await fetch(
        `${apiUrl}/return-orders/${id}/status/${status}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      message.success(`Return order ${id} status updated to ${status}`);
    } catch (error) {
      message.error(`Failed to update return order ${id} status`);
    }
  };

  const moreMenu = (_order: IReturnOrder) => (
    <Menu
      mode="vertical"
      onClick={({ domEvent }) => {
        domEvent.stopPropagation();
      }}
    >
      <Menu.Item
        key="accept"
        style={{
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 500,
        }}
        disabled={record.status !== 0}
        icon={
          <CheckCircleOutlined
            style={{
              color: '#52c41a',
              fontSize: 17,
              fontWeight: 500,
            }}
          />
        }
        onClick={() => handleUpdateStatus(record.id, 1)}
      >
        {t('buttons.accept')}
      </Menu.Item>
      <Menu.Item
        key="reject"
        style={{
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 500,
        }}
        disabled={record.status !== 0}
        icon={
          <CloseCircleOutlined
            style={{
              color: '#EE2A1E',
              fontSize: 17,
            }}
          />
        }
        onClick={() => handleUpdateStatus(record.id, -1)}
      >
        {t('buttons.reject')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={moreMenu(record)} trigger={['click']}>
      <TableActionButton />
    </Dropdown>
  );
};
