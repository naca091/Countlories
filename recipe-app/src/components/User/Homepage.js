import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Spin, Card, Carousel, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import MenuDetailModal from "./Menu/MenuDetailModal";
import Header from "./header";
import Footer from "./footer";
import banner1 from "./images/banner1.jpg";
import banner2 from "./images/banner2.png";
import banner3 from "./images/banner3.png";
import banner4 from "./images/banner4.png";
import "./fontend/homepage.css";

const Homepage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { userEmail, userxu: initialUserXu } = state || {
    userEmail: "",
    userxu: 0,
  };

  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userXu, setUserXu] = useState(initialUserXu);
  const [purchasedMenus, setPurchasedMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/menus");
        if (response.data.success) {
          setMenus(response.data.data);
          setFilteredMenus(response.data.data);
        }
      } catch (error) {
        message.error("Failed to load menus");
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMenu(null);
  };

  const handlePurchaseSuccess = (newXuBalance, menuId) => {
    setUserXu(newXuBalance);
    setPurchasedMenus([...purchasedMenus, menuId]);
  };

  const bannerImages = [banner1, banner2, banner3, banner4];

  return (
    <div>
      <Header
        userEmail={userEmail}
        userXu={userXu}
        navigateToProfile={() => navigate("/user/profile")}
        handleLogout={() => navigate("/login")}
      />
      <Carousel autoplay className="rounded-lg overflow-hidden carousel">
        {bannerImages.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Banner ${index + 1}`}
              className="rounded-lg"
            />
          </div>
        ))}
      </Carousel>
      <div className="banner-line"></div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredMenus.map((menu) => (
            <Col span={8} key={menu._id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={menu.name}
                    src={`http://localhost:5000${menu.image}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                }
                onClick={() => handleMenuClick(menu)}
                style={{ cursor: "pointer" }}
              >
                <Card.Meta
                  title={menu.name}
                  description={
                    purchasedMenus.includes(menu._id)
                      ? "Unlocked"
                      : `Unlock Price: ${menu.unlockPrice} xu`
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {selectedMenu && (
        <MenuDetailModal
          menu={selectedMenu}
          visible={isModalVisible}
          onClose={handleCloseModal}
          userXu={userXu}
          purchasedMenus={purchasedMenus}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}
      <Footer />
    </div>
  );
};

export default Homepage;
