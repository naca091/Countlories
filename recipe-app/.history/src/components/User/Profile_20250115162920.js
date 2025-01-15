import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Input, Button, message, Spin, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Profile = () => {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUserData(response.data.user);
        form.setFieldsValue(response.data.user);
      }
    } catch (error) {
      message.error('Failed to fetch user data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (values) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/users/${userData.id}`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        message.success('Profile updated successfully');
        setUserData(response.data.data);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (values) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/users/${userData.id}/password`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        message.success('Password updated successfully');
        form.setFieldsValue({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card title={
        <div className="flex items-center gap-4">
          <Avatar size={64} icon={<UserOutlined />} src={userData?.avatar} />
          <div>
            <h2 className="text-2xl font-bold">{userData?.fullName}</h2>
            <p className="text-gray-500">{userData?.email}</p>
          </div>
        </div>
      }>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
            initialValues={userData}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Please enter your username' }]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="phone" label="Phone">
                <Input />
              </Form.Item>

              <Form.Item name="address" label="Address">
                <Input.TextArea />
              </Form.Item>

              <Form.Item label="XU Balance">
                <Input value={userData?.xu || 0} disabled />
              </Form.Item>
            </div>

            <Button type="primary" htmlType="submit" loading={updating}>
              Update Profile
            </Button>
          </Form>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <Form
            layout="vertical"
            onFinish={handleUpdatePassword}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter current password' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter new password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </div>

            <Button type="primary" htmlType="submit" loading={updating}>
              Update Password
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Profile;