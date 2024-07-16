import { SaveButton, useStepsForm } from '@refinedev/antd';
import { useGetToPath, useGo, useTranslate } from '@refinedev/core';
import { Button, Card, Flex, Form, Input, Modal, Steps } from 'antd';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type IReturnOrder = {
  partnerId: number;
  customerPackageId: number;
  customerId: number;
  dateReturn: string;
  name: string;
  address: string;
  phone: string;
  productReturnOrders: {
    quantity: number;
    productId: number;
    damagedLevel: number;
    thornMoney: number;
    description: string;
  }[];
};

const useFormList = (form: unknown) => {
  const t = useTranslate();

  const formList = useMemo(() => {
    const step1 = (
      <Flex
        key="return-orders"
        vertical
        style={{
          padding: '20px 24px',
        }}
      >
        <Form.Item
          label="Partner ID"
          name="partnerId"
          rules={[{ required: true }]}
        >
          <Input type="number" placeholder="Enter Partner ID" />
        </Form.Item>
        <Form.Item
          label="Customer Package ID"
          name="customerPackageId"
          rules={[{ required: true }]}
        >
          <Input type="number" placeholder="Enter Customer Package ID" />
        </Form.Item>
        <Form.Item
          label="Customer ID"
          name="customerId"
          rules={[{ required: true }]}
        >
          <Input type="number" placeholder="Enter Customer ID" />
        </Form.Item>
        <Form.Item
          label="Date Return"
          name="dateReturn"
          rules={[{ required: true }]}
        >
          <Input type="datetime-local" placeholder="Enter Date Return" />
        </Form.Item>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input type="text" placeholder="Enter Name" />
        </Form.Item>
        <Form.Item label="Address" name="address" rules={[{ required: true }]}>
          <Input type="text" placeholder="Enter Address" />
        </Form.Item>
        <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
          <Input type="text" placeholder="Enter Phone Number" />
        </Form.Item>
      </Flex>
    );

    const step2 = (
      <Flex
        key="product-return-orders"
        vertical
        style={{
          padding: '20px 24px',
        }}
      >
        <Form.List name="productReturnOrders">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} style={{ marginBottom: 16 }}>
                  <Form.Item
                    {...restField}
                    label="Quantity"
                    name={[name, 'quantity']}
                    rules={[{ required: true }]}
                  >
                    <Input type="number" placeholder="Enter Quantity" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Product ID"
                    name={[name, 'productId']}
                    rules={[{ required: true }]}
                  >
                    <Input type="number" placeholder="Enter Product ID" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Damaged Level"
                    name={[name, 'damagedLevel']}
                    rules={[{ required: true }]}
                  >
                    <Input type="number" placeholder="Enter Damaged Level" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Thorn Money"
                    name={[name, 'thornMoney']}
                    rules={[{ required: true }]}
                  >
                    <Input type="number" placeholder="Enter Thorn Money" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Description"
                    name={[name, 'description']}
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea rows={2} placeholder="Enter Description" />
                  </Form.Item>
                  <Button type="dashed" onClick={() => remove(name)}>
                    Delete
                  </Button>
                </Card>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                Add Product Return Order
              </Button>
            </>
          )}
        </Form.List>
      </Flex>
    );

    return [step1, step2];
  }, [form, t]);

  return { formList };
};

export const ReturnOrderCreate = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  const { current, gotoStep, stepsProps, form, saveButtonProps } =
    useStepsForm<IReturnOrder>();

  const { formList } = useFormList(form);

  const handleModalClose = () => {
    go({
      to:
        searchParams.get('to') ??
        getToPath({
          action: 'list',
        }) ??
        '',
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: 'replace',
    });
  };

  const isLastStep = current === formList.length - 1;
  const isFirstStep = current === 0;

  return (
    <Modal
      open
      destroyOnClose
      maskClosable={false}
      title="Create Return Order"
      footer={() => (
        <Flex align="center" justify="space-between">
          <Button onClick={handleModalClose}>Cancel</Button>
          <Flex align="center" gap={16}>
            <Button
              disabled={isFirstStep}
              onClick={() => gotoStep(current - 1)}
            >
              Previous Step
            </Button>
            {isLastStep ? (
              <SaveButton icon={false} {...saveButtonProps} />
            ) : (
              <Button type="primary" onClick={() => gotoStep(current + 1)}>
                Next Step
              </Button>
            )}
          </Flex>
        </Flex>
      )}
      onCancel={handleModalClose}
    >
      <Flex style={{ padding: '20px 24px' }}>
        <Steps {...stepsProps} responsive>
          <Steps.Step title="Return Order Details" />
          <Steps.Step title="Product Return Orders" />
        </Steps>
      </Flex>
      <Form {...form} layout="vertical">
        {formList[current]}
      </Form>
    </Modal>
  );
};
