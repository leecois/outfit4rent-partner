import { UploadOutlined } from '@ant-design/icons';
import { getValueFromEvent, SaveButton, useDrawerForm } from '@refinedev/antd';
import type { BaseKey } from '@refinedev/core';
import { useApiUrl, useGetToPath, useGo, useTranslate } from '@refinedev/core';
import {
  Avatar,
  Button,
  Flex,
  Form,
  Grid,
  Input,
  Segmented,
  Spin,
  Upload,
} from 'antd';
import { useSearchParams } from 'react-router-dom';

import type { IBrand } from '../../../interfaces';
import { Drawer } from '../../drawer';
import { useStyles } from './styled';

type Props = {
  id?: BaseKey;
  action: 'create' | 'edit';
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

interface UploadResponse {
  message: string;
  statusCode: string;
  data: string;
}

export const BrandDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IBrand>({
      resource: 'brands',
      id: props?.id,
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        props.onMutationSuccess?.();
      },
      meta: {
        populate: ['images'],
      },
    });

  const onDrawerClose = () => {
    close();

    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to:
        searchParameters.get('to') ??
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

  const watchedImages = Form.useWatch('images', formProps.form);
  const image = watchedImages?.[0] || null;
  const previewImageURL = image?.url || image?.response?.url;
  const title = props.action === 'edit' ? null : t('brands.actions.add');

  const handleUploadChange = (info: any) => {
    const { fileList } = info;
    const updatedFileList = fileList.map((file: any) => {
      if (file.response) {
        return {
          url: (file.response as UploadResponse).data,
        };
      }
      if (file.url) {
        return { url: file.url };
      }
      return file;
    });
    formProps.form?.setFieldsValue({ images: updatedFileList });
  };

  const handleFinish = (values: any) => {
    const { images, ...restValues } = values;
    const url = images && images[0] ? images[0].url : null;

    const transformedValues = {
      url,
      ...restValues,
    };
    formProps.onFinish?.(transformedValues);
  };

  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={title}
      width={breakpoint.sm ? '378px' : '100%'}
      zIndex={1001}
      onClose={onDrawerClose}
    >
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="images"
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            style={{ margin: 0 }}
            rules={[{ required: true }]}
            initialValue={
              formProps.initialValues?.url
                ? [{ url: formProps.initialValues.url }]
                : []
            }
          >
            <Upload.Dragger
              name="file"
              action={`${apiUrl}/brands/uploaded-file`}
              maxCount={1}
              accept=".png,.jpg,.jpeg"
              className={styles.uploadDragger}
              onChange={handleUploadChange}
              showUploadList={false}
            >
              <Flex
                vertical
                align="center"
                justify="center"
                style={{ position: 'relative', height: '100%' }}
              >
                <Avatar
                  shape="square"
                  style={{
                    aspectRatio: 1,
                    objectFit: 'contain',
                    width: previewImageURL ? '100%' : '48px',
                    height: previewImageURL ? '100%' : '48px',
                    marginTop: previewImageURL ? undefined : 'auto',
                    transform: previewImageURL ? undefined : 'translateY(50%)',
                  }}
                  src={previewImageURL || '/images/product-default-img.png'}
                  alt="Product Image"
                />
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    marginTop: 'auto',
                    marginBottom: '16px',
                    backgroundColor: theme.colorBgContainer,
                    ...(!!previewImageURL && {
                      position: 'absolute',
                      bottom: 0,
                    }),
                  }}
                >
                  {t('products.fields.images.description')}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item
            label={t('brands.fields.name')}
            name="name"
            className={styles.formItem}
            rules={[
              { required: true, message: 'Please enter the brand name.' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('brands.fields.description')}
            name="description"
            className={styles.formItem}
            rules={[
              {
                required: true,
                message: 'Please enter the brand description.',
              },
            ]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item
            label={t('brands.fields.isFeatured.label')}
            name="isFeatured"
            className={styles.formItem}
            initialValue={false}
          >
            <Segmented
              block
              size="large"
              options={[
                { label: t('brands.fields.isFeatured.true'), value: true },
                { label: t('brands.fields.isFeatured.false'), value: false },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={t('brands.fields.status.label')}
            name="status"
            className={styles.formItem}
            initialValue={0}
          >
            <Segmented
              block
              size="large"
              options={[
                { label: t('brands.fields.status.active'), value: 1 },
                { label: t('brands.fields.status.inactive'), value: 0 },
              ]}
            />
          </Form.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              padding: '16px 0',
            }}
          >
            <Button onClick={onDrawerClose}>Cancel</Button>
            <SaveButton {...saveButtonProps} htmlType="submit" type="primary">
              Save
            </SaveButton>
          </div>
        </Form>
      </Spin>
    </Drawer>
  );
};
