import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import "./fontend/login.css";

const Profile = () => {
  const { state } = useLocation();
  const [user, setUser] = useState(state?.user || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state?.user) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            "http://localhost:5000/api/auth/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data.user);
        } catch (error) {
          message.error("Failed to fetch user data.");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleUpdate = async (field) => {
    if (!user[field]) {
      message.warning("Please provide a valid value.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        { [field]: user[field] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`${field} updated successfully!`);
    } catch (error) {
      message.error("Failed to update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header
        userEmail={user.email}
        userXu={user.xu}
        navigateToProfile={() => {}}
        handleLogout={() => {}}
      />
      <div className="container">
        <div className="form-container" center>
          <div style={{ padding: "20px" }}>
            <h1>User Profile</h1>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Form layout="vertical">
                {Object.keys(user).map((key) => (
                  <Form.Item key={key} label={key}>
                    <Input
                      name={key}
                      value={user[key]}
                      onChange={handleInputChange}
                    />
                    <Button
                      type="primary"
                      onClick={() => handleUpdate(key)}
                      style={{ marginTop: "10px" }}
                    >
                      Update {key}
                    </Button>
                  </Form.Item>
                ))}
              </Form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
