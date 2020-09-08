import React from 'react';
import { Formik, Form } from 'formik';
// Ant Design
import { Button, Form as FormAnt, Alert } from 'antd';
import { Select, Input } from 'formik-antd';
// Reducer
import { types } from '../../../reducers/user';
// Validators
import { requiredField } from '../../../utils/validators';

const roles: Array<types.TRole> = ['author', 'student'];

type TAuthFormProps = {
  data: types.TUserData;
  onSubmit: (data: types.TUserData) => void;
};

const AuthForm: React.FC<TAuthFormProps> = ({ data, onSubmit }) => {
  return (
    <Formik initialValues={data} onSubmit={(value) => onSubmit(value)}>
      {({ errors, values }) => (
        <Form>
          <FormAnt.Item label="GitHub Id" htmlFor="githubId">
            <Input
              id="githubId"
              name="githubId"
              type="text"
              placeholder="github id"
              validate={requiredField}
            />
            {errors.githubId && (
              <Alert message={errors.githubId} type="error" showIcon />
            )}
          </FormAnt.Item>

          <FormAnt.Item label="Select role" htmlFor="role">
            <Select id="role" name="role" defaultValue={values.role}>
              {roles.map((role) => (
                <Select.Option key={role as string} value={role as string}>
                  {role}
                </Select.Option>
              ))}
            </Select>
          </FormAnt.Item>

          <Button type="primary" htmlType="submit">
            Sign In
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AuthForm;
