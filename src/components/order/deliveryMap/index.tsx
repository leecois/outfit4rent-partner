import type { IOrder } from '../../../interfaces';
import { Map } from '../../map';

type Props = {
  order?: IOrder;
};

// eslint-disable-next-line unused-imports/no-unused-vars
export const OrderDeliveryMap = ({ order }: Props) => {
  return (
    <Map
      mapProps={{
        center: {
          lat: 40.730_61,
          lng: -73.935_242,
        },
        zoom: 9,
      }}
    >
      {/* <MapMarker
        key={`user-marker-${order?.user.id}`}
        icon={{
          url: '/images/marker-customer.svg',
        }}
        position={{
          lat: Number(order?.adress.coordinate[0]),
          lng: Number(order?.adress.coordinate[1]),
        }}
      />
      <MapMarker
        key={`user-marker-${order?.user.id}`}
        icon={{
          url: '/images/marker-courier.svg',
        }}
        position={{
          lat: Number(order?.store.address.coordinate[0]),
          lng: Number(order?.store.address.coordinate[1]),
        }}
      /> */}
    </Map>
  );
};
