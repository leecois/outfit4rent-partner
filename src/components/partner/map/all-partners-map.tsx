import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  StopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useList, useNavigation, useTranslate } from '@refinedev/core';
import { Card, Flex, List, Tag, Typography } from 'antd';
import { useRef, useState } from 'react';

import type { IPartner } from '../../../interfaces';
import { BasicMarker } from '../../icons';
import { AdvancedMarker, Map } from '../../map';

export const AllPartnersMap = () => {
  const t = useTranslate();
  const parentRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [selectedPartner, setSelectedPartner] = useState<IPartner | null>(null);

  const { edit } = useNavigation();

  const { data: partnerData } = useList<IPartner>({
    resource: 'partners',
    pagination: {
      mode: 'off',
    },
  });
  const partners = partnerData?.data || [];

  const handleMarkerClick = (e: any, partner: IPartner) => {
    setSelectedPartner(partner);
  };

  return (
    <Flex
      ref={parentRef}
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Map
        mapProps={{
          setMap,
          mapId: 'all-partners-map',
          disableDefaultUI: true,
          center: {
            lat: 10.8447022,
            lng: 106.7618557,
          },
          zoom: 10,
        }}
      >
        {partners?.map((partner) => {
          const lat = parseFloat(partner.coordinate.x);
          const lng = parseFloat(partner.coordinate.y);

          if (!lat || !lng) return null;

          return (
            <AdvancedMarker
              key={partner.id}
              map={map}
              zIndex={selectedPartner?.id === partner.id ? 1 : 0}
              position={{
                lat,
                lng,
              }}
              onClick={(e: any) => {
                handleMarkerClick(e, partner);
              }}
            >
              {(selectedPartner?.id !== partner.id || !selectedPartner) && (
                <img src="/images/marker-store.svg" alt={partner.name} />
              )}
              {selectedPartner?.id === partner.id && (
                <Card
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPartner(null);
                  }}
                  style={{
                    position: 'relative',
                    marginBottom: '16px',
                  }}
                  bodyStyle={{
                    padding: '16px',
                  }}
                >
                  <Flex align="center" justify="space-between" gap={32}>
                    <Typography.Title
                      level={5}
                      onClick={() => {
                        edit('partners', selectedPartner.id);
                      }}
                      style={{
                        cursor: 'pointer',
                        fontWeight: '400',
                        marginBottom: '0px',
                      }}
                    >
                      {selectedPartner.name}
                    </Typography.Title>
                    <Tag
                      color={selectedPartner.status ? 'green' : 'default'}
                      style={{
                        color: selectedPartner.status ? 'green' : '#00000073',
                        marginInlineEnd: 0,
                      }}
                      icon={
                        selectedPartner.status ? (
                          <CheckCircleOutlined />
                        ) : (
                          <StopOutlined />
                        )
                      }
                    >
                      <Typography.Text
                        style={{
                          color: selectedPartner.status
                            ? '#3C8618'
                            : '00000073',
                        }}
                      >
                        {t(
                          `partners.fields.status.${selectedPartner.status ? 'active' : 'inactive'}`,
                        )}
                      </Typography.Text>
                    </Tag>
                  </Flex>
                  <List
                    dataSource={[
                      {
                        title: <EnvironmentOutlined />,
                        value: partner.address,
                      },
                      {
                        title: <UserOutlined />,
                        value: partner.email,
                      },
                      {
                        title: <PhoneOutlined />,
                        value: partner.phone,
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <Flex gap={8}>
                          <Typography.Text type="secondary">
                            {item.title}
                          </Typography.Text>
                          <Typography.Text type="secondary">
                            {item.value}
                          </Typography.Text>
                        </Flex>
                      </List.Item>
                    )}
                  />
                  <BasicMarker
                    style={{
                      color: 'white',
                      position: 'absolute',
                      bottom: '-16px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                </Card>
              )}
            </AdvancedMarker>
          );
        })}
      </Map>
    </Flex>
  );
};
