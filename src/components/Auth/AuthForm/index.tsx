import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
// Ant Design
import { Button, Form as FormAnt } from 'antd';
import { Select, Input } from 'formik-antd';
// Redux
import { types } from '../../../reducers/user';
// Common
import FieldWithAlert from '../../common/FieldWithAlert';
// Validators
import { requiredField } from '../../../utils/validators';

const roles: Array<types.TRole> = ['author', 'student'];

const AuthForm: React.FC = (props) => {
  return (
    <Formik
      initialValues={{
        githubId: '',
        role: 'author',
      }}
      onSubmit={(value) => console.log(value)}
    >
      <Form>
        <FormAnt.Item label="GitHub Id" htmlFor="githubId">
          <Input
            id="githubId"
            name="githubId"
            type="text"
            placeholder="github id"
          />
        </FormAnt.Item>

        <FormAnt.Item label="Select role" htmlFor="role">
          <Select id="role" name="role" defaultValue={roles[0]}>
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
    </Formik>
  );
};

export default AuthForm;
