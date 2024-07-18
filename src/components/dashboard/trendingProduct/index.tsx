import { useSimpleList } from '@refinedev/antd';
import { Avatar, Flex, List as AntdList, Typography } from 'antd';
import type { ReactNode } from 'react';

import {
  Rank1Icon,
  Rank2Icon,
  Rank3Icon,
  Rank4Icon,
  Rank5Icon,
} from '../../icons';

const RankIcons: Record<number, ReactNode> = {
  1: <Rank1Icon />,
  2: <Rank2Icon />,
  3: <Rank3Icon />,
  4: <Rank4Icon />,
  5: <Rank5Icon />,
};

interface ITrendingProduct {
  id: number;
  name: string;
  value: number;
  url: string;
}
export const TrendingProduct: React.FC = () => {
  const { listProps } = useSimpleList<ITrendingProduct>({
    resource: 'admin/quantity-renting',
    pagination: { pageSize: 5, current: 1 },
    syncWithLocation: false,
  });

  return (
    <AntdList
      {...listProps}
      pagination={false}
      size="large"
      bordered={false}
      renderItem={(item, index) => {
        return (
          <AntdList.Item
            key={index}
            style={{
              borderBlockEnd: 'none',
            }}
          >
            <Flex
              gap={24}
              style={{
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'relative',
                }}
              >
                <Avatar
                  shape="square"
                  style={{
                    borderRadius: 24,
                  }}
                  size={{
                    xs: 64,
                    sm: 64,
                    md: 64,
                    lg: 108,
                    xl: 120,
                    xxl: 120,
                  }}
                  src={item.url}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: -8,
                  }}
                >
                  {RankIcons[index + 1]}
                </div>
              </div>
              <Flex
                vertical
                gap="10px"
                justify="center"
                style={{
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <Flex vertical justify="center">
                  <div>
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 1,
                        tooltip: {
                          placement: 'top',
                          title: item.name,
                        },
                      }}
                      style={{
                        margin: 0,
                        fontSize: 24,
                      }}
                      strong={index <= 2}
                    >
                      {item.name}
                    </Typography.Paragraph>
                  </div>

                  <Typography.Text
                    style={{
                      fontSize: 16,
                    }}
                    type="secondary"
                  >
                    Renting{' '}
                    <Typography.Text strong>{item.value} </Typography.Text>
                    times
                  </Typography.Text>
                </Flex>
              </Flex>
            </Flex>
          </AntdList.Item>
        );
      }}
    />
  );
};
