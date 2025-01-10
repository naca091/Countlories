// RoleForm.js
import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const RoleForm = ({ visible, onCancel, onSuccess, initialValues }) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues?._id;

  React.useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      if (isEditing && initialValues?._id) {
        await axios.put(
          `http://localhost:5000/api/roles/${initialValues._id}`,
          values
        );
        message.success('Role updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/roles', values);
        message.success('Role added successfully');
      }
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Operation failed';
      message.error(errorMsg);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit Role' : 'Add New Role'}
      open={visible}
      onCancel={() => {
        form.resetFields();
        if (onCancel) {
          onCancel();
        }
      }}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Role Name"
          rules={[
            { required: true, message: 'Please input the role name!' },
            { min: 2, message: 'Name must be at least 2 characters long' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="id"
          label="Role Id"
          rules={[
            { required: true, message: 'Please input the role name!' },
            { min: 1, message: 'Name must be at least 2 characters long' }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleForm;