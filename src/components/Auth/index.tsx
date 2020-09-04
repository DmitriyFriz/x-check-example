import React from 'react';
// Ant Design
import { Form, Input, Button, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// Redux
import { useDispatch } from 'react-redux';
import { actions, types } from '../../reducers/user';
// Styles
import s from './Auth.module.css';

const Auth: React.FC = () => {
  const dispatch = useDispatch();

  const onFinish = (values: types.TUserData) => {
    dispatch(actions.signIn(values));
  };

  return (
    <div className={s.container}>
      <Form
        name="normal_login"
        className={s['login-form']}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="githubId"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="github id"
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select placeholder="Select a role" allowClear>
            <Select.Option value="male">author</Select.Option>
            <Select.Option value="female">student</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Auth;
