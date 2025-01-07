import React from "react";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./fontend/register.css"; // Đảm bảo bạn đã tạo file CSS riêng cho Register

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        values
      );

      if (response.data.success) {
        message.success("Registration successful");
        navigate("/login");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>
          Create Your Account
          <span aria-label="sparkles" role="img">
            ✨
          </span>
        </h1>
        <p>
          Join us today! Fill out the form below to get started on your journey.
        </p>
        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="fullName"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please input a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="phone">
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>
          <Form.Item name="address">
            <Input prefix={<HomeOutlined />} placeholder="Address" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Register
            </Button>
          </Form.Item>
          <div className="footer">
            <div className="text-center">
              <Button type="link" onClick={() => navigate("/login")}>
                Already have an account? Login
              </Button>
            </div>
            <p>© 2024 ALL RIGHTS RESERVED</p>
          </div>
        </Form>
      </div>
      <div className="image-container">
        <img
          alt="A beautiful image to inspire registration."
          height="600"
          src="https://storage.googleapis.com/a1aa/image/PljjEMSYjA7RDZGiXbl2V8co53pwHfSTOfEztlF93eq6t4EoA.jpg"
          width="450"
        />
      </div>
    </div>
  );
};

export default Register;
