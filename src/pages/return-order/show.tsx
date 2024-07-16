import { CloseCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { List, ListButton } from '@refinedev/antd';
import { useApiUrl, useShow, useTranslate } from '@refinedev/core';
import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Skeleton,
} from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { ButtonSuccess } from '../../button';
import { CardWithContent } from '../../components';
import { ReturnOrderDetails } from '../../components/return-orders/fieldsForm';
import { ReturnOrderStatus } from '../../components/return-orders/status';
import { ReturnOrderProducts } from '../../components/return-orders/tableProduct';
import type { IProductInReturnOrder, IReturnOrder } from '../../interfaces';

export const ReturnOrderShow = () => {
  const t = useTranslate();
  const { queryResult } = useShow<IReturnOrder>();
  const { data, isLoading } = queryResult;
  const [record, setRecord] = useState<IReturnOrder>();
  const apiUrl = useApiUrl();
  const [products, setProducts] = useState<IProductInReturnOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (data?.data) {
      setRecord(data.data);
    }
  }, [data]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.patch(
          `${apiUrl}/return-orders/${data?.data?.id}/products`,
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (data?.data?.id) {
      fetchProducts();
    }
  }, [apiUrl, data?.data?.id]);

  const handleUpdateProducts = async (values: any, status: number) => {
    setLoading(true);
    try {
      const formattedValues = {
        products: Object.keys(values).map((key) => ({
          id: key.split('_')[1],
          thornMoney: values[key].thornMoney,
          damagedLevel: values[key].damagedLevel,
        })),
      };
      const updatedReturnOrder = await axios.put(
        `${apiUrl}/return-orders/${record?.id}/status/${status}`,
        formattedValues,
      );
      const updatedRecord = updatedReturnOrder.data.data;
      setRecord(updatedRecord);
      const response = await axios.patch(
        `${apiUrl}/return-orders/${updatedRecord.id}/products`,
      );
      setProducts(response.data.data);
      message.success('Products updated successfully');
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to update products');
    } finally {
      setLoading(false);
    }
  };

  const canAcceptOrder = isLoading ? false : record?.status === 0;
  const canRejectOrder = isLoading ? false : record?.status === 0;

  return (
    <>
      <Flex>
        <ListButton icon={<LeftOutlined />}>
          {t('return-orders.return-orders')}
        </ListButton>
      </Flex>
      <Divider />
      <List
        breadcrumb={false}
        title={
          isLoading ? (
            <Skeleton.Input
              active
              style={{
                width: '144px',
                minWidth: '144px',
                height: '28px',
              }}
            />
          ) : (
            <>
              {`${t('return-orders.id')} #${record?.id}   `}
              <ReturnOrderStatus
                status={record?.status as number}
              ></ReturnOrderStatus>
            </>
          )
        }
        headerButtons={
          record?.status !== 0 ? (
            <ReturnOrderStatus status={record?.status as number} />
          ) : (
            <>
              <ButtonSuccess
                disabled={!canAcceptOrder}
                key="accept"
                onClick={() => setIsModalVisible(true)}
              >
                {t('buttons.accept')}
              </ButtonSuccess>
              <Button
                disabled={!canRejectOrder}
                key="reject"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleUpdateProducts({}, -1)}
              >
                {t('buttons.reject')}
              </Button>
            </>
          )
        }
      >
        <Row gutter={[16, 16]}>
          <Col xl={15} lg={24} md={24} sm={24} xs={24}>
            <Flex gap={16} vertical>
              <ReturnOrderDetails order={record as IReturnOrder} />
            </Flex>
          </Col>

          <Col xl={9} lg={24} md={24} sm={24} xs={24}>
            <CardWithContent
              bodyStyles={{
                padding: 0,
              }}
              title={t('orders.titles.return-orders.products')}
            >
              {record && (
                <ReturnOrderProducts
                  productsInReturnOrder={products}
                  isLoading={loading}
                />
              )}
            </CardWithContent>
          </Col>
        </Row>
      </List>

      <Modal
        title="Confirm returned products"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form
          form={form}
          onFinish={(values) => handleUpdateProducts(values, 1)}
        >
          {products.map((product) => (
            <div key={product.id} style={{ marginBottom: 16 }}>
              <Image
                width={50}
                src={product.product.images[0].url}
                alt={product.product.name}
                style={{ marginRight: 16 }}
              />
              <Form.Item
                label={product.product.name}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Input.Group compact>
                  <Form.Item
                    name={[`product_${product.id}`, 'thornMoney']}
                    noStyle
                    rules={[
                      { required: true, message: 'Please input thorn money!' },
                    ]}
                  >
                    <InputNumber placeholder="Thorn Money" />
                  </Form.Item>
                  <Form.Item
                    name={[`product_${product.id}`, 'damagedLevel']}
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: 'Please input damaged level!',
                      },
                    ]}
                  >
                    <InputNumber placeholder="Damaged Level" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </div>
          ))}
        </Form>
      </Modal>
    </>
  );
};
