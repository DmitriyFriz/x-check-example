// React / Redux
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Ant Design
import { Select, Form } from 'antd';
import { actions, selectors, operations } from '../../reducers/reviews';
// Reducer
// components
// Styles
// import s from './Auth.module.css';

const Reviews: React.FC = () => {
  // const selectedId = useSelector(selectors.getCurrentSessionId);
  const sessionsName = useSelector(selectors.getSessionsName);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(operations.setSessionsData(undefined));
  }, [dispatch]);

  return (
    <div>
      <h1>Reviews</h1>
      <Form>
        <Form.Item label="Select task" htmlFor="tasks">
          <Select id="tasks">
            {sessionsName.map((name) => (
              <Select.Option key={name} value={name}>{name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Reviews;
