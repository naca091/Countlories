// // src/components/Login.jsx
import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./fontend/login.css";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        values
      );

      if (response.data.success) {
        const { user } = response.data;
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(user));

        message.success("Login successful");

        // Redirect to /user/homepage
        navigate("/user/homepage");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>
          Welcome Back
          <span aria-label="wave" role="img">
            {" "}
            👋{" "}
          </span>
        </h1>
        <p>
          Today is a new day. It's your day. You shape it. Sign in to start
          managing your projects.
        </p>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username or email!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username or Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <div className="form-container">
            <a href="#">Forgot Password?</a>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Sign in
            </Button>
          </Form.Item>
          <div className="footer">
            <div className="text-center">
              <Button type="link" onClick={() => navigate("/register")}>
                Don't have an account? Register
              </Button>
            </div>
            <p>© 2024 ALL RIGHTS RESERVED</p>
          </div>
        </Form>
      </div>
      <div className="image-container">
        <img
          alt="A beautiful still life painting of a bouquet of flowers in a vase."
          height="600"
          src="https://storage.googleapis.com/a1aa/image/PljjEMSYjA7RDZGiXbl2V8co53pwHfSTOfEztlF93eq6t4EoA.jpg"
          width="450"
        />
      </div>
    </div>
  );
};

export default Login;
