import type { UseFormProps } from '@refinedev/antd';
import { Col, Row, Spin } from 'antd';

import { PartnerMap } from '../map';
import { PartnerFormFields } from './fields';
import { usePartnerForm } from './usePartnerForm';

type Props = {
  action: UseFormProps['action'];
};

export const PartnerForm = (props: Props) => {
  const {
    partner,
    handleMapOnDragEnd,
    formProps,
    saveButtonProps,
    handleAddressChange,
    formLoading,
    isFormDisabled,
    setIsFormDisabled,
    latLng,
  } = usePartnerForm({
    action: props.action,
  });

  return (
    <Spin spinning={formLoading}>
      <Row gutter={16} wrap>
        <Col xs={24} md={12} lg={9}>
          <PartnerFormFields
            formProps={formProps}
            saveButtonProps={saveButtonProps}
            action={props.action}
            isFormDisabled={isFormDisabled}
            setIsFormDisabled={setIsFormDisabled}
            handleAddressChange={handleAddressChange}
          />
        </Col>
        <Col
          xs={24}
          md={12}
          lg={15}
          style={{
            height: props.action === 'create' ? 'calc(100vh - 300px)' : '432px',
            marginTop: '64px',
          }}
        >
          <PartnerMap
            lat={latLng?.lat}
            lng={latLng?.lng}
            zoom={props.action === 'create' ? 4 : 10}
            partner={partner}
            isDisabled={isFormDisabled}
            onDragEnd={handleMapOnDragEnd}
          />
        </Col>
        <Col
          xs={24}
          sm={{
            span: 24,
            offset: 0,
          }}
          lg={{
            span: 15,
            offset: 9,
          }}
        ></Col>
      </Row>
    </Spin>
  );
};
