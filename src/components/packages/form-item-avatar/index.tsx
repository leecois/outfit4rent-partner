import { CloudUploadOutlined } from '@ant-design/icons';
import type { UseFormReturnType } from '@refinedev/antd';
import { getValueFromEvent } from '@refinedev/antd';
import { useApiUrl } from '@refinedev/core';
import { Avatar, Flex, Form, Upload } from 'antd';

import type { IPackage } from '../../../interfaces';
import { useStyles } from './styled';

type Props = {
  formProps: UseFormReturnType<IPackage>['formProps'];
  showUploadOverlay?: boolean;
  containerStyle?: React.CSSProperties;
  disabled?: boolean;
};

export const PackageFormItemAvatar = ({
  formProps,
  containerStyle,
  showUploadOverlay = true,
  disabled,
}: Props) => {
  const apiUrl = useApiUrl();
  const { styles } = useStyles();

  const avatars = Form.useWatch('url', formProps.form);
  const avatar = avatars?.[0] || null;
  const previewImageURL = avatar?.url || avatar?.data?.url;

  return (
    <Form.Item
      name="url"
      valuePropName="fileList"
      getValueFromEvent={getValueFromEvent}
      className={styles.formItem}
      style={{
        margin: 0,
        ...containerStyle,
      }}
      rules={[
        {
          required: true,
        },
      ]}
    >
      <Upload.Dragger
        name="file"
        action={`${apiUrl}/packages/uploaded-file`}
        maxCount={1}
        accept=".png"
        showUploadList={false}
        className={styles.upload}
      >
        <Flex
          vertical
          align="center"
          justify="center"
          className={styles.container}
        >
          <Avatar
            shape="circle"
            className={styles.avatar}
            src={previewImageURL || '/images/package-default-avatar.png'}
            alt="Package Avatar"
          />
          {showUploadOverlay && !disabled && (
            <div className={styles.overlay}>
              <CloudUploadOutlined className={styles.overlayIcon} />
            </div>
          )}
        </Flex>
      </Upload.Dragger>
    </Form.Item>
  );
};
