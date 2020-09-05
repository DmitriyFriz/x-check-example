import React from 'react';
// Ant Design
import { Form, Input, Button, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// Redux
import { useDispatch } from 'react-redux';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { actions, types } from '../../reducers/user';
// Styles
import s from './Auth.module.css';

const AuthForm: React.FC<InjectedFormProps> = (props) => {
  const { handleSubmit } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          name="githubId"
          component="input"
          type="text"
          placeholder="github id"
        />
      </div>
      <div>
        <Field name="role" component="select">
          <option value="author">Author</option>
          <option value="student">Student</option>
        </Field>
      </div>
      <div>
        <button type="submit">Sign In</button>
      </div>
    </form>
  );
};

const ReduxForm = reduxForm({
  form: 'auth',
})(AuthForm);

const Auth: React.FC = () => {
  const dispatch = useDispatch();
  const onSubmit = (formData: any) => {
    console.log(formData);
  };

  return (
    <div className={s.container}>
      <h1>Authorization </h1>
      <ReduxForm onSubmit={onSubmit} />
    </div>
  );
};

export default Auth;
