import {
  ClockCircleOutlined,
  DollarCircleOutlined,
  DownOutlined,
  RiseOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { List, NumberField } from '@refinedev/antd';
import { useApiUrl, useCustom } from '@refinedev/core';
import type { MenuProps } from 'antd';
import { Button, Col, Dropdown, Flex, Row, theme } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CardWithContent,
  CardWithPlot,
  DailyOrders,
  DailyRevenue,
  NewCustomers,
  OrderTimeline,
  RecentOrders,
  TrendDownIcon,
  TrendingMenu,
  TrendUpIcon,
} from '../../components';
import type { ApiResponse, ISalesChart } from '../../interfaces';

type DateFilter = 'lastWeek' | 'lastMonth';

const DATE_FILTERS: Record<
  DateFilter,
  {
    text: string;
    value: DateFilter;
  }
> = {
  lastWeek: {
    text: 'lastWeek',
    value: 'lastWeek',
  },
  lastMonth: {
    text: 'lastMonth',
    value: 'lastMonth',
  },
};

export const DashboardPage: React.FC = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const API_URL = useApiUrl();

  const [selecetedDateFilter, setSelectedDateFilter] = useState<DateFilter>(
    DATE_FILTERS.lastWeek.value,
  );

  const dateFilters: MenuProps['items'] = useMemo(() => {
    const filters = Object.keys(DATE_FILTERS) as Array<DateFilter>;

    return filters.map((filter) => {
      return {
        key: DATE_FILTERS[filter].value,
        label: t(`dashboard.filter.date.${DATE_FILTERS[filter].text}`),
        onClick: () => {
          setSelectedDateFilter(DATE_FILTERS[filter].value);
        },
      };
    });
  }, []);

  const dateFilterQuery = useMemo(() => {
    const now = dayjs();
    switch (selecetedDateFilter) {
      case 'lastWeek': {
        return {
          start: now.subtract(6, 'days').startOf('day').format(),
          end: now.endOf('day').format(),
        };
      }
      case 'lastMonth': {
        return {
          start: now.subtract(1, 'month').startOf('day').format(),
          end: now.endOf('day').format(),
        };
      }
      default: {
        return {
          start: now.subtract(7, 'days').startOf('day').format(),
          end: now.endOf('day').format(),
        };
      }
    }
  }, [selecetedDateFilter]);

  const { data: dailyRevenueData } = useCustom<ApiResponse<ISalesChart>>({
    url: `${API_URL}/admin/daily-revenue`,
    method: 'get',
    config: {
      query: dateFilterQuery,
    },
  });

  const { data: dailyOrdersData } = useCustom<ApiResponse<ISalesChart>>({
    url: `${API_URL}/admin/daily-orders`,
    method: 'get',
    config: {
      query: dateFilterQuery,
    },
  });

  const { data: newCustomersData } = useCustom<ApiResponse<ISalesChart>>({
    url: `${API_URL}/admin/new-customers`,
    method: 'get',
    config: {
      query: dateFilterQuery,
    },
  });

  const revenue = useMemo(() => {
    const data = dailyRevenueData?.data?.data.data;
    if (!data) return { data: [], trend: 0 };

    const plotData = data.map((item) => {
      const date = dayjs(item.date);
      return {
        timeUnix: date.unix(),
        timeText: date.format('DD MMM YYYY'),
        value: item.value,
        state: 'Daily Revenue',
      };
    });

    return {
      data: plotData,
      trend: dailyRevenueData.data.data.trend,
    };
  }, [dailyRevenueData]);

  const orders = useMemo(() => {
    const data = dailyOrdersData?.data?.data.data;
    if (!data) return { data: [], trend: 0 };

    const plotData = data.map((order) => {
      const date = dayjs(order.date);
      return {
        timeUnix: date.unix(),
        timeText: date.format('DD MMM YYYY'),
        value: order.value,
        state: 'Daily Orders',
      };
    });

    return {
      data: plotData,
      trend: dailyOrdersData.data.data.trend,
    };
  }, [dailyOrdersData]);

  const newCustomers = useMemo(() => {
    const data = newCustomersData?.data?.data?.data;
    if (!data) return { data: [], trend: 0 };

    const plotData = data.map((customer) => {
      const date = dayjs(customer.date);
      return {
        timeUnix: date.unix(),
        timeText: date.format('DD MMM YYYY'),
        value: customer.value,
        state: 'New Customers',
      };
    });

    return {
      data: plotData,
      trend: newCustomersData.data.data.trend,
    };
  }, [newCustomersData]);

  return (
    <List
      title={t('dashboard.overview.title')}
      headerButtons={() => (
        <Dropdown menu={{ items: dateFilters }}>
          <Button>
            {t(
              `dashboard.filter.date.${DATE_FILTERS[selecetedDateFilter].text}`,
            )}
            <DownOutlined />
          </Button>
        </Dropdown>
      )}
    >
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 10 }} lg={24} md={24} sm={24} xs={24}>
              <CardWithPlot
                icon={
                  <DollarCircleOutlined
                    style={{
                      fontSize: 14,
                      color: token.colorPrimary,
                    }}
                  />
                }
                title={t('dashboard.dailyRevenue.title')}
                rightSlot={
                  <Flex align="center" gap={8}>
                    <NumberField
                      value={revenue.trend}
                      options={{
                        style: 'currency',
                        currency: 'USD',
                      }}
                    />
                    {revenue.trend > 0 ? <TrendUpIcon /> : <TrendDownIcon />}
                  </Flex>
                }
              >
                <DailyRevenue height={170} data={revenue.data} />
              </CardWithPlot>
            </Col>
            <Col xl={{ span: 7 }} lg={12} md={24} sm={24} xs={24}>
              <CardWithPlot
                icon={
                  <ShoppingOutlined
                    style={{
                      fontSize: 14,
                      color: token.colorPrimary,
                    }}
                  />
                }
                rightSlot={
                  <Flex align="center" gap={8}>
                    <NumberField value={orders.trend} />
                    {orders.trend > 0 ? <TrendUpIcon /> : <TrendDownIcon />}
                  </Flex>
                }
                title={t('dashboard.dailyOrders.title')}
              >
                <DailyOrders height={170} data={orders.data} />
              </CardWithPlot>
            </Col>
            <Col xl={{ span: 7 }} lg={12} md={24} sm={24} xs={24}>
              <CardWithPlot
                icon={
                  <UserOutlined
                    style={{
                      fontSize: 14,
                      color: token.colorPrimary,
                    }}
                  />
                }
                title={t('dashboard.newCustomers.title')}
                rightSlot={
                  <Flex align="center" gap={8}>
                    <NumberField
                      value={newCustomers.trend / 100}
                      options={{
                        style: 'percent',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }}
                    />
                    {newCustomers.trend > 0 ? (
                      <TrendUpIcon />
                    ) : (
                      <TrendDownIcon />
                    )}
                  </Flex>
                }
              >
                <NewCustomers height={170} data={newCustomers.data} />
              </CardWithPlot>
            </Col>
          </Row>
        </Col>
        <Col xl={15} lg={15} md={24} sm={24} xs={24}>
          <CardWithContent
            bodyStyles={{
              height: '432px',
              overflow: 'hidden',
              padding: 0,
            }}
            icon={
              <ClockCircleOutlined
                style={{
                  fontSize: 14,
                  color: token.colorPrimary,
                }}
              />
            }
            title={t('dashboard.deliveryMap.title')}
          ></CardWithContent>
        </Col>
        <Col xl={9} lg={9} md={24} sm={24} xs={24}>
          <CardWithContent
            bodyStyles={{
              height: '430px',
              overflow: 'hidden',
              padding: 0,
            }}
            icon={
              <ClockCircleOutlined
                style={{
                  fontSize: 14,
                  color: token.colorPrimary,
                }}
              />
            }
            title={t('dashboard.timeline.title')}
          >
            <OrderTimeline height={'432px'} />
          </CardWithContent>
        </Col>
        <Col xl={15} lg={15} md={24} sm={24} xs={24}>
          <CardWithContent
            bodyStyles={{
              padding: '1px 0px 0px 0px',
            }}
            icon={
              <ShoppingOutlined
                style={{
                  fontSize: 14,
                  color: token.colorPrimary,
                }}
              />
            }
            title={t('dashboard.recentOrders.title')}
          >
            <RecentOrders />
          </CardWithContent>
        </Col>
        <Col xl={9} lg={9} md={24} sm={24} xs={24}>
          <CardWithContent
            bodyStyles={{
              padding: 0,
            }}
            icon={
              <RiseOutlined
                style={{
                  fontSize: 14,
                  color: token.colorPrimary,
                }}
              />
            }
            title={t('dashboard.trendingProducts.title')}
          >
            <TrendingMenu />
          </CardWithContent>
        </Col>
      </Row>
    </List>
  );
};
