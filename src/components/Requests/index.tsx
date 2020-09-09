// React / Redux
import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// Ant Design
import { Select, Form } from 'antd';
// Reducer
// components
// Styles
// import s from './Auth.module.css';

const Requests: React.FC = () => {
  return (
    <div>
      <h1>Requests</h1>
      <Form.Item label="Select task" htmlFor="tasks">
        <Select id="tasks">
          <Select.Option value="songbird">songbird</Select.Option>
          <Select.Option value="x-check">x-check</Select.Option>
          <Select.Option value="singolo">singolo</Select.Option>
        </Select>
      </Form.Item>
    </div>
  );
};

export default Requests;
