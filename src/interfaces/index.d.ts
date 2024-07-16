import type { Dayjs } from 'dayjs';

export interface IProductInOrder {
  id: number;
  deposit: number;
  status: number;
  productId: number;
  userPackageId: number;
  dateGive: Date;
  dateReceive: Date;
  tornMoney: number;
  quantity: number;
}

///
export interface IOrderChart {
  count: number;
  status:
    | 'waiting'
    | 'ready'
    | 'on the way'
    | 'delivered'
    | 'could not be delivered';
}

export interface IOrderTotalCount {
  total: number;
  totalDelivered: number;
}

interface ApiResponse<T> {
  message: string;
  statusCode: string;
  data: {
    data: T[];
    trend: number;
    total: number;
  };
}

interface ISalesChart {
  date: string;
  value: number;
}

export interface IOrderStatus {
  id: number;
  text: 'Pending' | 'Ready' | 'On The Way' | 'Delivered' | 'Cancelled';
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  picture: string;
  phone: string;
  address: string;
  status: number;
}

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
}

export interface IAddress {
  text: string;
  coordinate: [number, number];
}

export interface IFile {
  name: string;
  percent: number;
  size: number;
  status: 'error' | 'success' | 'done' | 'uploading' | 'removed';
  type: string;
  uid: string;
  url: string;
}

export interface IEvent {
  date: string;
  status: string;
}

export interface IStore {
  id: number;
  title: string;
  isActive: boolean;
  createdAt: string;
  gsm: string;
  email: string;
  address: IAddress;
  products: Array<IProduct>;
}

export interface ICourierStatus {
  id: number;
  text: 'Available' | 'Offline' | 'On delivery';
}

export interface IPackage {
  id: number;
  url: string;
  name: string;
  price: number;
  availableRentDays: number;
  description: string;
  status: number;
  numOfProduct: number;
  isFeatured: boolean;
}
// Define the interface for the partner data
export interface ICoordinate {
  x: string;
  y: string;
}

export interface IArea {
  id: number;
  address: string;
  district: string;
  city: string;
}

export interface IPartner {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: number;
  areaId: number;
  area: IArea;
  coordinate: ICoordinate;
}

export interface IOrder {
  id: number;
  customerId: number;
  packageId: number;
  packageName: string;
  dateFrom: Date;
  dateTo: Date;
  price: number;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  status: number;
  transactionId: number;
  quantityOfItems: number;
  totalDeposit: number;
  createdAt: Date;
}

export interface IBrand {
  id: number;
  name: string;
  url: string;
  description: string;
  status: number;
  isFeatured: boolean;
}

export interface IImage {
  id: number;
  url: string;
  idProduct: number;
}

export interface IProductList {
  id: number;
  name: string;
  price: number;
  size: string;
  description: string;
  status: number;
  isUsed: string;
  deposit: number;
  idCategory: number;
  quantity: number;
  availableQuantity: number;
  idBrand: number;
  type: string;
  isFeatured: boolean;
  images: IImage[];
}

export interface ICategory {
  id: number;
  name: string;
  description: string;
  status: number;
  url: string;
  isFeatured: boolean;
}

export interface IOrderFilterVariables {
  q?: string;
  store?: string;
  user?: string;
  createdAt?: [Dayjs, Dayjs];
  status?: string;
}

export interface IUserFilterVariables {
  q: string;
  status: boolean;
  createdAt: [Dayjs, Dayjs];
  gender: string;
  isActive: boolean;
}

export interface IReview {
  id: number;
  content: string;
  title: string;
  numberStars: number;
  customerId: number;
  productId: number;
  reviewImages: string[];
}

export type IVehicle = {
  model: string;
  vehicleType: string;
  engineSize: number;
  color: string;
  year: number;
  id: number;
};

export interface ITrendingProducts {
  id: number;
  product: IProduct;
  orderCount: number;
}
export interface ICategoryPackage {
  id: number;
  maxAvailableQuantity: number;
  categoryId: number;
  status: number;
  packageId: number;
}

export interface IReturnOrder {
  id: number;
  dateReturn: Date;
  name: string;
  address: string;
  phone: string;
  status: number;
  totalThornMoney: number;
  customerId: number;
  partnerId: number;
  quantityOfItems: number;
  customerPackageId: number;
  createdAt: Date;
}
export interface IProductInReturnOrder {
  id: number;
  quantity: string;
  damagedLevel: number;
  thornMoney: number;
  status: number;
  returnOrderId: number;
  productId: number;
  product: IProductList;
  description: string;
}
