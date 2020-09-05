import React from 'react';
// Redux
import { useDispatch } from 'react-redux';
import {
  Field,
  reduxForm,
  InjectedFormProps,
  FormSubmitHandler,
} from 'redux-form';
import { types, operations } from '../../reducers/user';
// Styles
import s from './Auth.module.css';

const AuthForm: React.FC<InjectedFormProps<types.TUserData>> = (props) => {
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
