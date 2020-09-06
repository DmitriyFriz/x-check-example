import React, { useEffect } from 'react';
// Ant Design
import { Button, Form } from 'antd';
// Redux
import { Field, InjectedFormProps } from 'redux-form';
import { types } from '../../../reducers/user';
// Common
import FieldWithAlert from '../../common/FieldWithAlert';
// Validators
import { requiredField } from '../../../utils/validators';

const roles: Array<types.TRole> = ['author', 'student'];

const AuthForm: React.FC<InjectedFormProps<types.TUserData>> = (props) => {
  const { handleSubmit, change } = props;

  useEffect(() => change('role', 'author'), []);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Form.Item name="githubId" label="GitHub Id">
          <Field
            name="githubId"
            component={FieldWithAlert}
            type="text"
            label="GitHub Id"
            placeholder="github id"
            validate={[requiredField]}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item label="Select role">
          {roles.map((role) => (
            <label key={role} htmlFor={role as string}>
              <Field
                name="role"
                value={role as string}
                component="input"
                type="radio"
                id={role as string}
              />
              {role}
            </label>
          ))}
        </Form.Item>
      </div>

      <div>
        <Button type="primary" htmlType="submit">
          Sign In
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;
