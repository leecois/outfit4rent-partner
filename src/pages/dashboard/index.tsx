import { DownOutlined, RiseOutlined } from '@ant-design/icons';
import { List } from '@refinedev/antd';
import type { MenuProps } from 'antd';
import { Button, Col, Dropdown, Row, theme } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CardWithContent } from '../../components';
import { TrendingProduct } from '../../components/dashboard/trendingProduct';

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
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
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
            title={t('dashboard.trendingProduct.title')}
          >
            <TrendingProduct />
          </CardWithContent>
        </Col>
      </Row>
    </List>
  );
};
