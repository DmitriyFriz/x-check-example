import React from 'react';
import { Input, Alert } from 'antd';
import { WrappedFieldProps } from 'redux-form';

type TRenderFieldProps = WrappedFieldProps &
React.InputHTMLAttributes<HTMLInputElement> & { label: string };

const FieldWithAlert: React.FC<TRenderFieldProps> = ({
  input,
  label,
  id,
  type,
  meta: { touched, error, warning },
}) => (
  <div>
    <div>
      <Input {...input} placeholder={label} type={type} id={id} />
      {touched &&
        ((error && <Alert message={error} type="error" showIcon />) ||
          (warning && <Alert message={warning} type="warning" showIcon />))}
    </div>
  </div>
);

export default FieldWithAlert;
