import type { UseFormProps } from '@refinedev/antd';
import { useForm } from '@refinedev/antd';
import { useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';

import type { IPartner } from '../../../interfaces';
import type { LatLng } from '../../../utils';
import {
  convertLatLng,
  getAddressWithLatLng,
  getLatLngWithAddress,
} from '../../../utils';

type Props = {
  action: UseFormProps['action'];
};

export const usePartnerForm = (props: Props) => {
  const [isFormDisabled, setIsFormDisabled] = useState(
    () => props.action === 'edit',
  );

  const form = useForm<IPartner>({
    action: props.action,
    redirect: false,
    onMutationSuccess: () => {
      setIsFormDisabled(true);
    },
  });
  const partner = form.queryResult?.data?.data;

  const [latLng, setLatLng] = useState<Partial<LatLng>>({
    lat: props.action === 'create' ? 10.8447022 : undefined,
    lng: props.action === 'create' ? 106.7618557 : undefined,
  });

  useEffect(() => {
    if (partner?.coordinate) {
      setLatLng({
        lat: parseFloat(partner.coordinate.x),
        lng: parseFloat(partner.coordinate.y),
      });
    }
  }, [partner?.coordinate]);

  const debouncedAddressValue = useDebounce(
    form.formProps.form?.getFieldValue('address'),
    500,
  );

  useEffect(() => {
    if (debouncedAddressValue) {
      getLatLngWithAddress(debouncedAddressValue).then((data) => {
        if (data) {
          const { lat, lng } = convertLatLng({
            lat: data.lat,
            lng: data.lng,
          });

          form.formProps.form?.setFieldValue('coordinate', {
            x: lat.toString(),
            y: lng.toString(),
          });

          setLatLng({
            lat,
            lng,
          });
        }
      });
    }
  }, [debouncedAddressValue, form.formProps.form]);

  const handleMapOnDragEnd = async ({
    lat,
    lng,
  }: {
    lat: number;
    lng: number;
  }) => {
    const data = await getAddressWithLatLng({ lat, lng });
    if (data) {
      form.formProps.form?.setFieldValue('address', data.address);
      form.formProps.form?.setFieldValue('coordinate', {
        x: lat.toString(),
        y: lng.toString(),
      });
      setLatLng({ lat, lng });
    }
  };

  const handleSetIsFormDisabled = (value: boolean) => {
    form.formProps.form?.resetFields();
    setIsFormDisabled(value);
  };

  const isLoading = form.queryResult?.isFetching || form.formLoading;

  return {
    ...form,
    partner,
    formLoading: isLoading,
    latLng,
    isFormDisabled,
    setIsFormDisabled: handleSetIsFormDisabled,
    handleAddressChange: (address: string) =>
      form.formProps.form?.setFieldValue('address', address),
    handleMapOnDragEnd,
  };
};
