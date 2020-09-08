import React from 'react';
import { shallow } from 'enzyme';
import AuthForm from '.';
import { types } from '../../../reducers/user';

const userData: types.TUserData = {
  githubId: 'jack',
  role: 'author',
};

const onSubmit = jest.fn();

describe('AuthForm component: submit', () => {
  const wrapper = shallow(
    <AuthForm data={userData} onSubmit={onSubmit} />
  );
  wrapper.find('Formik').simulate('submit', userData);

  it('should called submit', () => {
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should called submit with data', () => {
    expect(onSubmit).toBeCalledWith(userData);
  });
});



