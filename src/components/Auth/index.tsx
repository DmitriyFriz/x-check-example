// React / Redux
import React from 'react';
import { useDispatch } from 'react-redux';
import { reduxForm, FormSubmitHandler } from 'redux-form';
import { types, operations } from '../../reducers/user';
// components
import AuthForm from './AuthForm';
// Styles
import s from './Auth.module.css';

const ReduxForm = reduxForm<types.TUserData>({
  form: 'auth',
})(AuthForm);

const Auth: React.FC = () => {
  const dispatch = useDispatch();
  const onSubmit: FormSubmitHandler<types.TUserData> = (formData) => {
    dispatch(operations.signIn(formData));
  };

  return (
    <div className={s.container}>
      <h1>Authorization </h1>
      <ReduxForm onSubmit={onSubmit} />
    </div>
  );
};

export default Auth;
