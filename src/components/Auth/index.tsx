// React / Redux
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Reducer
import { types, operations, selectors } from '../../reducers/user';
// components
import AuthForm from './AuthForm';
// Styles
import s from './Auth.module.css';

const Auth: React.FC = () => {
  const userData = useSelector(selectors.getUserData);
  const dispatch = useDispatch();
  
  const handleSubmit = (data: types.TUserData) => {
    dispatch(operations.signIn(data));
  };

  return (
    <div className={s.container}>
      <h1>Authorization </h1>
      <AuthForm data={userData} onSubmit={handleSubmit} />
    </div>
  );
};

export default Auth;
