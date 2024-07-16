import { UploadOutlined } from '@ant-design/icons';
import type { UseFormReturnType } from '@refinedev/antd';
import { SaveButton, useSelect, useStepsForm } from '@refinedev/antd';
import { useApiUrl, useGetToPath, useGo, useTranslate } from '@refinedev/core';
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Modal,
  Segmented,
  Select,
  Steps,
  Upload,
} from 'antd';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { ICategory, IPackage } from '../../interfaces';

const useFormList = (props: UseFormListProps) => {
  const t = useTranslate();
  const apiUrl = useApiUrl();

  const { selectProps: categoriesSelectProps } = useSelect<ICategory>({
    resource: 'categories',
    optionValue: 'id',
    optionLabel: 'name',
  });

  const handleUploadChange = (info: any) => {
    const { fileList } = info;
    const updatedFileList = fileList.map((file: any) => {
      if (file.response) {
        return {
          url: (file.response as UploadResponse).data,
        };
      }
      return file;
    });
    props.formProps.form?.setFieldsValue({ url: updatedFileList[0].url });
  };

  const formList = useMemo(() => {
    const step1 = (
      <Flex
        key="personal"
        vertical
        style={{
          padding: '20px 24px',
        }}
      >
        <Upload.Dragger
          name="file"
          action={`${apiUrl}/packages/uploaded-file`}
          accept=".png,.jpg,.jpeg"
          showUploadList={true}
          onChange={handleUploadChange}
          listType="picture-card"
        >
          <Button icon={<UploadOutlined />}>
            {t('packages.fields.images.description')}
          </Button>
        </Upload.Dragger>
        <Form.Item
          label={t('packages.fields.name.label')}
          name="name"
          rules={[{ required: true }]}
        >
          <Input
            type="text"
            placeholder={t('packages.fields.name.placeholder')}
          />
        </Form.Item>
        <Form.Item
          label={t('packages.fields.price.label')}
          name="price"
          rules={[{ required: true }]}
        >
          <Input
            type="number"
            placeholder={t('packages.fields.price.placeholder')}
          />
        </Form.Item>
        <Form.Item
          label={t('packages.fields.rentalPeriod.label')}
          name="availableRentDays"
          rules={[{ required: true }]}
        >
          <Input
            type="number"
            placeholder={t('packages.fields.rentalPeriod.placeholder')}
          />
        </Form.Item>
        <Form.Item
          label={t('packages.fields.numOfProduct.label')}
          name="numOfProduct"
          rules={[{ required: true }]}
        >
          <Input
            type="number"
            placeholder={t('packages.fields.numOfProduct.placeholder')}
          />
        </Form.Item>
        <Form.Item
          label={t('packages.fields.description.label')}
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea
            rows={4}
            placeholder={t('packages.fields.description.placeholder')}
          />
        </Form.Item>
        <Form.Item
          label={t('packages.fields.status.label')}
          name="status"
          // className={styles.formItem}
          initialValue={1}
        >
          <Segmented
            block
            size="large"
            options={[
              {
                label: t('packages.fields.status.active'),
                value: 1,
              },
              {
                label: t('packages.fields.status.inactive'),
                value: 0,
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          label={t('packages.fields.isFeatured.label')}
          name="isFeatured"
          // className={styles.formItem}
          initialValue={true}
        >
          <Segmented
            block
            size="large"
            options={[
              {
                label: t('packages.fields.status.active'),
                value: true,
              },
              {
                label: t('packages.fields.status.inactive'),
                value: false,
              },
            ]}
          />
        </Form.Item>
      </Flex>
    );

    const step2 = (
      <Flex
        key="categories"
        vertical
        style={{
          padding: '20px 24px',
        }}
      >
        <Form.List name="categories">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} style={{ marginBottom: 16 }}>
                  <Form.Item
                    {...restField}
                    label={t('packages.fields.category.label')}
                    name={[name, 'id']}
                    rules={[{ required: true }]}
                  >
                    <Select
                      {...categoriesSelectProps}
                      labelInValue
                      onChange={(value) => {
                        props.formProps.form?.setFieldValue(
                          ['categories', name, 'categoryId'],
                          value.value,
                        );
                      }}
                      placeholder={t('packages.fields.category.placeholder')}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label={t('packages.fields.quantity.label')}
                    name={[name, 'maxAvailableQuantity']}
                    rules={[{ required: true }]}
                  >
                    <Input
                      type="number"
                      placeholder={t('packages.fields.quantity.placeholder')}
                    />
                  </Form.Item>
                  <Button type="dashed" onClick={() => remove(name)}>
                    {t('buttons.delete')}
                  </Button>
                </Card>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                {t('buttons.add')}
              </Button>
            </>
          )}
        </Form.List>
      </Flex>
    );
    return [step1, step2];
  }, [props.formProps, categoriesSelectProps, t]);

  return { formList };
};

export const PackagesCreate = () => {
  const t = useTranslate();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  // const { token } = theme.useToken();

  const { current, gotoStep, stepsProps, formProps, saveButtonProps } =
    useStepsForm<IPackage>();

  const { formList } = useFormList({ formProps });

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
      title={t('packages.actions.add')}
      // style={{
      //   header: {
      //     padding: '20px 24px',
      //     margin: 0,
      //     borderBottom: `1px solid ${token.colorBorderSecondary}`,
      //   },
      //   footer: {
      //     padding: '20px 24px',
      //     margin: 0,
      //     borderTop: `1px solid ${token.colorBorderSecondary}`,
      //   },
      //   content: {
      //     padEnd: 0,
      //     padStart: 0,
      //   },
      // }}
      footer={() => (
        <Flex align="center" justify="space-between">
          <Button onClick={handleModalClose}>{t('buttons.cancel')}</Button>
          <Flex align="center" gap={16}>
            <Button
              disabled={isFirstStep}
              onClick={() => gotoStep(current - 1)}
            >
              {t('buttons.previousStep')}
            </Button>
            {isLastStep ? (
              <SaveButton icon={false} {...saveButtonProps} />
            ) : (
              <Button type="primary" onClick={() => gotoStep(current + 1)}>
                {t('buttons.nextStep')}
              </Button>
            )}
          </Flex>
        </Flex>
      )}
      onCancel={handleModalClose}
    >
      <Flex style={{ padding: '20px 24px' }}>
        <Steps {...stepsProps} responsive>
          <Steps.Step title={t('packages.steps.general')} />
          <Steps.Step title={t('packages.steps.categories')} />
        </Steps>
      </Flex>
      <Form {...formProps} layout="vertical">
        {formList[current]}
      </Form>
    </Modal>
  );
};

type UseFormListProps = {
  formProps: UseFormReturnType<IPackage>['formProps'];
};

type UploadResponse = {
  message: string;
  statusCode: string;
  data: string;
};
