import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';
import type { UseFormReturnType } from '@refinedev/antd';
import { DeleteButton, ListButton, SaveButton } from '@refinedev/antd';
import type { UseFormProps } from '@refinedev/core';
import { useNavigation, useTranslate } from '@refinedev/core';
import type { InputProps, InputRef } from 'antd';
import {
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Segmented,
} from 'antd';
import { useEffect, useRef } from 'react';
import InputMask from 'react-input-mask';

import type { IPartner } from '../../../interfaces';
import { FormItemEditable, FormItemHorizontal } from '../../form';
import { PartnerStatus } from '../status';

type Props = {
  formProps: UseFormReturnType<IPartner>['formProps'];
  saveButtonProps: UseFormReturnType<IPartner>['saveButtonProps'];
  action: UseFormProps['action'];
  isFormDisabled: boolean;
  setIsFormDisabled: (value: boolean) => void;
  handleAddressChange: (address: string) => void;
};

export const PartnerFormFields = ({
  formProps,
  saveButtonProps,
  action,
  isFormDisabled,
  setIsFormDisabled,
  handleAddressChange,
}: Props) => {
  const titleInputRef = useRef<InputRef>(null);

  const t = useTranslate();
  const { list } = useNavigation();

  useEffect(() => {
    if (!isFormDisabled) {
      titleInputRef.current?.focus();
    }
  }, [isFormDisabled]);

  const statusField = Form.useWatch('status', formProps.form);

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
          placeholder={t('partners.fields.name')}
        />
      </FormItemEditable>
      <Card
        bodyStyle={{
          padding: 0,
        }}
      >
        <FormItemHorizontal
          name="status"
          initialValue={0}
          icon={<RightCircleOutlined />}
          label={t('partners.fields.status.label')}
        >
          {isFormDisabled ? (
            <PartnerStatus value={statusField} />
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
          icon={<MailOutlined />}
          label={t('partners.fields.email')}
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Please input a valid email!',
            },
          ]}
        >
          <Input />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="address"
          icon={<EnvironmentOutlined />}
          label={t('partners.fields.address')}
          flexProps={{
            align: 'flex-start',
          }}
          rules={[
            {
              required: true,
              message: 'Please input the address!',
            },
          ]}
        >
          <Input.TextArea
            rows={2}
            onChange={(e) => {
              handleAddressChange(e.target.value);
            }}
          />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="phone"
          icon={<PhoneOutlined />}
          label={t('partners.fields.phone')}
          rules={[
            {
              required: true,
              message: 'Please input a valid phone number!',
            },
          ]}
        >
          <InputMask mask="999 999 9999">
            {/* 
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore */}
            {(props: InputProps) => <Input {...props} />}
          </InputMask>
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="areaId"
          icon={<PhoneOutlined />}
          label={t('partners.fields.phone')}
          rules={[
            {
              required: true,
              message: 'Please input a valid phone number!',
            },
          ]}
        >
          <InputMask mask="9">
            {/* 
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore */}
            {(props: InputProps) => <Input {...props} />}
          </InputMask>
        </FormItemHorizontal>
      </Card>
      <Flex
        align="center"
        justify="space-between"
        style={{
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
      </Flex>

      {/* this is a workaround for registering fields to ant design form */}
      {/* otherwise these fields will be null */}
      <Flex
        vertical
        style={{
          display: 'none',
        }}
      >
        <Form.Item
          name={['coordinate', 'x']}
          style={{
            display: 'none',
          }}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber
            style={{
              width: '100%',
            }}
            addonBefore="Lat"
          />
        </Form.Item>
        <Form.Item
          style={{
            display: 'none',
          }}
          name={['coordinate', 'y']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber
            addonBefore="Lng"
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
      </Flex>
    </Form>
  );
};
