import 'dayjs/locale/de';
import '@refinedev/antd/dist/reset.css';

import {
  BuildOutlined,
  DashboardOutlined,
  ProductOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  ErrorComponent,
  ThemedLayoutV2,
  useNotificationProvider,
} from '@refinedev/antd';
import type { IResourceItem } from '@refinedev/core';
import { Authenticated, Refine } from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools';
import { RefineKbarProvider } from '@refinedev/kbar';
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import { authProvider } from './authProvider';
import { Header, Title } from './components';
import { BikeWhiteIcon } from './components/icons';
import { ConfigProvider } from './context';
import { useAutoLoginForDemo } from './hooks';
import { AuthPage } from './pages/auth';
import { BrandCreate, BrandEdit, BrandList, BrandShow } from './pages/brands';
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from './pages/categories';
import { CustomerList, CustomerShow } from './pages/customers';
import { DashboardPage } from './pages/dashboard';
import { OrderList, OrderShow } from './pages/orders';
import { PackagesCreate, PackagesEdit, PackagesList } from './pages/packages';
import { PartnerCreate, PartnerEdit, PartnerList } from './pages/partners';
import {
  ProductCreate,
  ProductEdit,
  ProductList,
  ProductShow,
} from './pages/products';
import { ReturnOrderList, ReturnOrderShow } from './pages/return-order';
import { dataProvider } from './rest-data-provider';

interface TitleHandlerOptions {
  resource?: IResourceItem;
}

const customTitleHandler = ({ resource }: TitleHandlerOptions): string => {
  const baseTitle = 'Outfit4Rent';
  const titleSegment = resource?.name;
  const title = titleSegment ? `${titleSegment} | ${baseTitle}` : baseTitle;
  return title;
};
const App: React.FC = () => {
  // This hook is used to automatically login the user.
  // We use this hook to skip the login page and demonstrate the application more quickly.
  const { loading } = useAutoLoginForDemo();

  const API_URL = import.meta.env.VITE_API_URL;

  const data = dataProvider(API_URL);

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, parameters: object) => t(key, parameters),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <ConfigProvider>
        <RefineKbarProvider>
          <DevtoolsProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={data}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: 'vJyqp2-XpgDqf-5v0KTA',
              }}
              notificationProvider={useNotificationProvider}
              resources={[
                {
                  name: 'dashboard',
                  list: '/',
                  meta: {
                    label: 'Dashboard',
                    icon: <DashboardOutlined />,
                  },
                },
                {
                  name: 'orders',
                  list: '/orders',
                  show: '/orders/:id',
                  meta: {
                    icon: <ShoppingOutlined />,
                  },
                },
                {
                  name: 'return-orders',
                  list: '/return-orders',
                  show: '/return-orders/:id',
                  meta: {
                    icon: <ShoppingOutlined />,
                  },
                },
                {
                  name: 'customers',
                  list: '/customers',
                  show: '/customers/:id',
                  meta: {
                    icon: <UserOutlined />,
                  },
                },
                {
                  name: 'products',
                  list: '/products',
                  create: '/products/new',
                  edit: '/products/:id/edit',
                  show: '/products/:id',
                  meta: {
                    icon: <ProductOutlined />,
                  },
                },
                {
                  name: 'categories',
                  list: '/categories',
                  create: '/categories/new',
                  edit: '/categories/:id/edit',
                  show: '/categories/:id',
                  meta: {
                    icon: <TagsOutlined />,
                  },
                },
                {
                  name: 'brands',
                  list: '/brands',
                  create: '/brands/new',
                  edit: '/brands/:id/edit',
                  show: '/brands/:id',
                  meta: {
                    icon: <BuildOutlined />,
                  },
                },
                {
                  name: 'partners',
                  list: '/partners',
                  create: '/partners/new',
                  edit: '/partners/:id/edit',
                  meta: {
                    icon: <ShopOutlined />,
                  },
                },
                {
                  name: 'packages',
                  list: '/packages',
                  create: '/packages/new',
                  edit: '/packages/:id/edit',
                  show: '/packages/:id',
                  meta: {
                    icon: <BikeWhiteIcon />,
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-routes"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2 Header={Header} Title={Title}>
                        <div
                          style={{
                            maxWidth: '1200px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}
                        >
                          <Outlet />
                        </div>
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="/orders">
                    <Route index element={<OrderList />} />
                    <Route path=":id" element={<OrderShow />} />
                  </Route>
                  <Route
                    path="/customers"
                    element={
                      <CustomerList>
                        <Outlet />
                      </CustomerList>
                    }
                  >
                    <Route path=":id" element={<CustomerShow />} />
                  </Route>
                  <Route
                    path="/products"
                    element={
                      <ProductList>
                        <Outlet />
                      </ProductList>
                    }
                  >
                    <Route path="new" element={<ProductCreate />} />
                    <Route path=":id" element={<ProductShow />} />
                    <Route path=":id/edit" element={<ProductEdit />} />
                  </Route>
                  ///
                  <Route path="/return-orders">
                    <Route index element={<ReturnOrderList />} />
                    <Route path=":id" element={<ReturnOrderShow />} />
                  </Route>
                  <Route path="/partners">
                    <Route index element={<PartnerList />} />
                    <Route path="new" element={<PartnerCreate />} />
                    <Route path=":id/edit" element={<PartnerEdit />} />
                  </Route>
                  <Route
                    path="/categories"
                    element={
                      <CategoryList>
                        <Outlet />
                      </CategoryList>
                    }
                  >
                    <Route path="new" element={<CategoryCreate />} />
                    <Route path=":id" element={<CategoryShow />} />
                    <Route path=":id/edit" element={<CategoryEdit />} />
                  </Route>
                  <Route
                    path="/brands"
                    element={
                      <BrandList>
                        <Outlet />
                      </BrandList>
                    }
                  >
                    <Route path="new" element={<BrandCreate />} />
                    <Route path=":id" element={<BrandShow />} />
                    <Route path=":id/edit" element={<BrandEdit />} />
                  </Route>
                  <Route path="/packages">
                    <Route
                      path=""
                      element={
                        <PackagesList>
                          <Outlet />
                        </PackagesList>
                      }
                    >
                      <Route path="new" element={<PackagesCreate />} />
                    </Route>

                    <Route path=":id/edit" element={<PackagesEdit />} />
                  </Route>
                </Route>

                <Route
                  element={
                    <Authenticated key="auth-pages" fallback={<Outlet />}>
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route
                    path="/login"
                    element={
                      <AuthPage
                        type="login"
                        formProps={{
                          initialValues: {
                            email: 'leecois@gmail.com',
                            password: '123456',
                          },
                        }}
                      />
                    }
                  />
                </Route>

                <Route
                  element={
                    <Authenticated key="catch-all">
                      <ThemedLayoutV2 Header={Header} Title={Title}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler handler={customTitleHandler} />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </RefineKbarProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
