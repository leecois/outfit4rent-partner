import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  RightCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { UseFormReturnType } from '@refinedev/antd';
import {
  DeleteButton,
  ImageField,
  ListButton,
  SaveButton,
} from '@refinedev/antd';
import type { UseFormProps } from '@refinedev/core';
import { useApiUrl, useNavigation, useTranslate } from '@refinedev/core';
import type { InputRef } from 'antd';
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Segmented,
  Tag,
  Upload,
} from 'antd';
import { useEffect, useRef, useState } from 'react';

import type { IPackage } from '../../../interfaces';
import { FormItemEditable, FormItemHorizontal } from '../../form';
import { PackageStatus } from '../status';

type Props = {
  formProps: UseFormReturnType<IPackage>['formProps'];
  saveButtonProps: UseFormReturnType<IPackage>['saveButtonProps'];
  action: UseFormProps['action'];
  isFormDisabled: boolean;
  setIsFormDisabled: (value: boolean) => void;
};

type UploadResponse = {
  message: string;
  statusCode: string;
  data: string;
};

export const PackageFormFields = ({
  formProps,
  saveButtonProps,
  action,
  isFormDisabled,
  setIsFormDisabled,
}: Props) => {
  const titleInputRef = useRef<InputRef>(null);
  const apiUrl = useApiUrl();
  const t = useTranslate();
  const { list } = useNavigation();
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isFormDisabled) {
      titleInputRef.current?.focus();
    }
  }, [isFormDisabled]);

  const statusField = Form.useWatch('status', formProps.form);
  const isFeaturedField = Form.useWatch('isFeatured', formProps.form);

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
    setImageUrl(updatedFileList[0]?.url || null);
    formProps.form?.setFieldsValue({ url: updatedFileList[0]?.url });
  };

  return (
    <Form {...formProps} layout="horizontal" disabled={isFormDisabled}>
      <FormItemEditable
        formItemProps={{
          name: 'name',
          style: {
            marginBottom: '32px',
          },
          rules: [
            {
              required: true,
              message: 'Please input the name!',
            },
          ],
        }}
      >
        <Input
          ref={titleInputRef}
          size="large"
          placeholder={t('packages.fields.name')}
        />
      </FormItemEditable>
      <Card
        bodyStyle={{
          padding: 0,
        }}
      >
        <FormItemHorizontal
          name="url"
          icon={<RightCircleOutlined />}
          label={t('packages.fields.image.label')}
        >
          {isFormDisabled ? (
            <ImageField
              value={formProps.form?.getFieldValue('url')}
              width={175}
              height={175}
            />
          ) : (
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
          )}
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="status"
          initialValue={0}
          icon={<RightCircleOutlined />}
          label={t('packages.fields.status.label')}
        >
          {isFormDisabled ? (
            <PackageStatus value={statusField} />
          ) : (
            <Segmented
              options={[
                {
                  label: t('partners.fields.status.inactive'),
                  value: 0,
                },
                {
                  label: t('partners.fields.status.active'),
                  value: 1,
                },
              ]}
            />
          )}
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="isFeatured"
          initialValue={false}
          icon={<RightCircleOutlined />}
          label={t('packages.fields.isFeatured.label')}
        >
          {isFormDisabled ? (
            <Tag color={isFeaturedField ? 'blue' : 'grey'}>
              {isFeaturedField ? 'Featured' : 'Not Featured'}
            </Tag>
          ) : (
            <Segmented
              options={[
                { label: t('partners.fields.status.inactive'), value: false },
                { label: t('partners.fields.status.active'), value: true },
              ]}
            />
          )}
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          icon={<MailOutlined />}
          label={t('packages.fields.rentalPeriod.label')}
          name="availableRentDays"
          rules={[
            {
              required: true,
              message: 'Please input a valid number of days!',
            },
          ]}
        >
          <Input type="number" />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="price"
          icon={<PhoneOutlined />}
          label={t('packages.fields.price.label')}
          rules={[
            {
              required: true,
              message: 'Please input a valid price!',
            },
          ]}
        >
          <Input type="number" />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="numOfProduct"
          icon={<PhoneOutlined />}
          label={t('packages.fields.numOfProduct.label')}
          rules={[
            {
              required: true,
              message: 'Please input a valid number of products!',
            },
          ]}
        >
          <Input type="number" />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="description"
          icon={<PhoneOutlined />}
          label={t('packages.fields.description.label')}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </FormItemHorizontal>
      </Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '16px 16px 0px 16px',
        }}
      >
        {action === 'create' && (
          <>
            <ListButton icon={false}>{t('actions.cancel')}</ListButton>
            <SaveButton
              {...saveButtonProps}
              style={{
                marginLeft: 'auto',
              }}
              htmlType="submit"
              type="primary"
              icon={null}
            >
              Save
            </SaveButton>
          </>
        )}
        {action === 'edit' &&
          (isFormDisabled ? (
            <>
              <DeleteButton
                type="text"
                onSuccess={() => {
                  list('partners');
                }}
                style={{
                  marginLeft: '-16px',
                }}
              />
              <Button
                style={{
                  marginLeft: 'auto',
                }}
                disabled={false}
                icon={<EditOutlined />}
                onClick={() => {
                  setIsFormDisabled(false);
                }}
              >
                {t('actions.edit')}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setIsFormDisabled(true);
                }}
              >
                {t('actions.cancel')}
              </Button>
              <SaveButton
                {...saveButtonProps}
                style={{
                  marginLeft: 'auto',
                }}
                htmlType="submit"
                type="primary"
                icon={null}
              >
                Save
              </SaveButton>
            </>
          ))}
      </div>
    </Form>
  );
};
