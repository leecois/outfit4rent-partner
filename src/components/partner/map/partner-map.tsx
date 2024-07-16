import { Flex } from 'antd';
import _debounce from 'lodash/debounce';
import { useCallback } from 'react';

import type { IPartner } from '../../../interfaces';
import { convertLatLng } from '../../../utils';
import { Map, MapMarker } from '../../map';

type Props = {
  partner?: IPartner;
  lat?: number;
  lng?: number;
  zoom?: number;
  isDisabled?: boolean;
  onDragEnd?: ({ lat, lng }: { lat: number; lng: number }) => void;
};

export const PartnerMap = (props: Props) => {
  const onDragEndDebounced = useCallback(
    _debounce((lat, lng) => {
      if (props.onDragEnd) {
        props.onDragEnd({ lat, lng });
      }
    }, 1000),
    [props.onDragEnd],
  );

  const handleDragEnd = (e: any) => {
    if (!props.onDragEnd) return;

    const { lat, lng } = convertLatLng({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
    onDragEndDebounced.cancel();
    onDragEndDebounced(lat, lng);
  };

  const lat = Number(props.lat);
  const lng = Number(props.lng);

  return (
    <Flex
      style={{
        height: '100%',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Map
        mapProps={{
          mapId: 'partner-map',
          center: {
            lat: lat || 10.8447022,
            lng: lng || 106.7618557,
          },
        }}
      >
        {lat && lng && (
          <MapMarker
            key={props.partner?.id}
            icon={{
              url: props.isDisabled
                ? '/images/marker-store.svg'
                : '/images/marker-store-pick.svg',
            }}
            position={{
              lat,
              lng,
            }}
            onDragEnd={props.isDisabled ? undefined : handleDragEnd}
          />
        )}
      </Map>
    </Flex>
  );
};
