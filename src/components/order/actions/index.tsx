import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useApiUrl, useTranslate } from '@refinedev/core';
import { Dropdown, Menu, message } from 'antd';

import type { IOrder } from '../../../interfaces';
import { TableActionButton } from '../../tableActionButton';

type OrderActionProps = {
  record: IOrder;
  onStatusUpdated: () => void;
};

export const OrderActions: React.FC<OrderActionProps> = ({
  record,
  onStatusUpdated,
}) => {
  const t = useTranslate();
  const apiUrl = useApiUrl();

  const handleUpdateStatus = async (id: number, status: number) => {
    try {
      const response = await fetch(`${apiUrl}/orders/${id}/status/${status}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      message.success(`Order ${id} status updated to ${status}`);
      onStatusUpdated(); // Trigger the callback to refresh the table
    } catch (error) {
      message.error(`Failed to update order ${id} status`);
    }
  };

  const moreMenu = (_order: IOrder) => (
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
