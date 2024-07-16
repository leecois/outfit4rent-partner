// import { useList, useNavigation } from '@refinedev/core';

// import type { IOrder } from '../../../interfaces';
// import { Map, MapMarker } from '../..';

// export const AllOrdersMap: React.FC = () => {
//   const { data: orderData } = useList<IOrder>({
//     resource: 'orders',
//     config: {
//       filters: [
//         {
//           field: 'status.text',
//           operator: 'eq',
//           value: 'On The Way',
//         },
//       ],
//       pagination: {
//         mode: 'off',
//       },
//     },
//   });

//   const defaultProps = {
//     center: {
//       lat: 40.730_61,
//       lng: -73.935_242,
//     },
//     zoom: 10,
//   };

//   const { show } = useNavigation();

//   return (
//     // <Map mapProps={defaultProps}>
//     //   {orderData?.data.map((order) => {
//     //     return (
//     //       // <MapMarker
//     //       //   key={order.id}
//     //       //   onClick={() => {
//     //       //     show('orders', order.id);
//     //       //   }}
//     //       //   icon={{
//     //       //     url: '/images/marker-courier.svg',
//     //       //   }}
//     //       //   position={{
//     //       //     lat: Number(order.adress.coordinate[0]),
//     //       //     lng: Number(order.adress.coordinate[1]),
//     //       //   }}
//     //       // />
//     //     );
//     //   })}
//     //   {orderData?.data.map((order) => {
//     //     return (
//     //       <MapMarker
//     //         key={order.id}
//     //         onClick={() => {
//     //           show('orders', order.id);
//     //         }}
//     //         icon={{
//     //           url: '/images/marker-customer.svg',
//     //         }}
//     //         // position={{
//     //         //   lat: Number(order.store.address.coordinate[0]),
//     //         //   lng: Number(order.store.address.coordinate[1]),
//     //         // }}
//     //       />
//     //     );
//     //   })}
//     // </Map>
//   );
// };
