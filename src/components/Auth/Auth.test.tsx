import React from 'react';
import * as redux from 'react-redux';
import { shallow } from 'enzyme';
import Auth from '.';
import { types } from '../../reducers/user';

const spySelector = jest.spyOn(redux, 'useSelector');
const spyDispatch = jest.spyOn(redux, 'useDispatch');
const userData: types.TUserData = {
  githubId: null,
  role: 'author',
};
spySelector.mockReturnValue(userData);
spyDispatch.mockReturnValue(jest.fn());

describe('Auth component', () => {
  const wrapper = shallow(<Auth />);

  it('should render title', () => {
    expect(wrapper.find('h1').text()).toBe('Authorization');
  });

  it('should render AuthForm', () => {
    expect(wrapper.find('AuthForm')).toHaveLength(1);
  });
});


