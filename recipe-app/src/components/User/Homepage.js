import React, { useState, useEffect } from "react";
import {
  Input,
  Badge,
  Button,
  Carousel,
  Card,
  Menu,
  Pagination,
  Dropdown,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  PlayCircleOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  CalculatorOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { MenuDetailModal } from "../Menu"; // Assuming MenuDetailModal is a separate component
import "./fontend/homepage.css";
import "./fontend/footer.css";
import "./fontend/header.css";
import banner1 from "./images/banner1.jpg";
import banner2 from "./images/banner2.png";
import banner3 from "./images/banner3.png";
import banner4 from "./images/banner4.png";

const { Search } = Input;

const Homepage = () => {
  // State for menus
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const menusPerPage = 20;

  // State for user
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const path = require("path");

  // Fetch menus from API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/menus");
        setMenus(response.data.data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };
    fetchMenus();
  }, []);

  // Get user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Handle menu click (show modal with menu details)
  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setModalVisible(true);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const renderMenuItems = () => {
    const startIndex = (currentPage - 1) * menusPerPage;
    const endIndex = startIndex + menusPerPage;
    const pagedMenus = menus.slice(startIndex, endIndex);

    return pagedMenus.map((menu, index) => (
      <div
        key={index}
        className="menu-item flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
        onClick={() => handleMenuClick(menu)}
      >
        <img
          src={`http://localhost:5000${menu.image}`}
          alt={menu.name}
          className="menu-image mb-4"
        />
        <h3 className="text-lg font-semibold">{menu.name}</h3>
        <p className="text-gray-600 text-sm text-center">{menu.description}</p>
      </div>
    ));
  };

  // Dropdown menu for user profile and logout
  const userMenu = (
    <Menu>
      <Button>
        <Menu.Item key="profile" onClick={() => navigate("/user/profile")}>
          View Profile
        </Menu.Item>
      </Button>
      <Button>
        <Menu.Item key="logout" onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Button>
    </Menu>
  );

  const bannerImages = [banner1, banner2, banner3, banner4];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
          <h1>FoodApp</h1>
        </div>

        <div className="search-bar">
          <Input
            placeholder="Search for recipes..."
            prefix={<SearchOutlined />}
            style={{ width: "300px" }}
          />
        </div>

        <div className="user-actions">
          {user ? (
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <Button
                type="link"
                icon={<UserOutlined />}
                className="text-green-600"
              >
                {user.username}
              </Button>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button
                type="link"
                icon={<UserOutlined />}
                className="text-green-600"
              >
                Login / Register
              </Button>
            </Link>
          )}
          <Badge count={0}>
            <Button
              type="link"
              icon={<ShoppingCartOutlined />}
              className="text-green-600"
            >
              Cart
            </Button>
          </Badge>
        </div>
      </div>

      {/* Secondary Navbar */}
      <div className="navbar secondary-navbar">
        <div className="nav-links">
          <Button
            type="link"
            className="text-green-600 flex items-center"
            icon={<HomeOutlined />}
          >
            Home
          </Button>
          <Button
            type="link"
            className="text-green-600 flex items-center"
            icon={<AppstoreOutlined />}
          >
            Products
          </Button>
          <Button
            type="link"
            className="text-green-600 flex items-center"
            icon={<BookOutlined />}
          >
            Recipes
          </Button>
          <Button
            type="link"
            className="text-green-600 flex items-center"
            icon={<CalculatorOutlined />}
          >
            Calories Tool
          </Button>
          <Button
            type="link"
            className="text-green-600 flex items-center"
            icon={<PlusCircleOutlined />}
          >
            Add Coins
          </Button>
          <Button
            type="link"
            className="text-green-600 flex items-center"
            icon={<PlayCircleOutlined />}
          >
            Watch Ads
          </Button>
        </div>
      </div>

      {/* Banner Carousel */}
      {/* Banner Carousel */}
      <div className="container mx-auto px-4 py-6">
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
      </div>

      <div className="banner-line"></div>

      {/* Menu Grid with Pagination */}
      <div className="container mx-auto px-4 py-6 menu-container">
        {renderMenuItems()}
      </div>

      {/* Phân trang căn giữa */}
      <div className="pagination-container">
        <Pagination
          current={currentPage}
          total={menus.length}
          pageSize={menusPerPage}
          onChange={setCurrentPage}
        />
      </div>

      {/* Menu Detail Modal */}
      <MenuDetailModal
        menu={selectedMenu}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      {/* foooter */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-top-content">
              <div className="footer-top-img">
                <img src="./assets/img/logofootercalo.png" alt="" />
              </div>
              <div className="footer-top-subbox">
                <div className="footer-top-subs">
                  <h2 className="footer-top-subs-title">Đăng ký nhận tin</h2>
                  <p className="footer-top-subs-text">
                    Nhận thông tin mới nhất từ chúng tôi
                  </p>
                </div>
                <form className="form-ground">
                  <input
                    type="email"
                    className="form-ground-input"
                    placeholder="Nhập email của bạn"
                  />
                  <button className="form-ground-btn">
                    <span>ĐĂNG KÝ</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="widget-area">
          <div className="container">
            <div className="widget-row">
              <div className="widget-row-col-1">
                <h3 className="widget-title">Về chúng tôi</h3>
                <div className="widget-row-col-content">
                  <p>CountCalo là ........</p>
                </div>
                <div className="widget-social">
                  <div className="widget-social-item">
                    <a href="">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </div>
                  <div className="widget-social-item">
                    <a href="">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                  <div className="widget-social-item">
                    <a href="">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                  <div className="widget-social-item">
                    <a href="">
                      <i className="fab fa-whatsapp"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="widget-row-col">
                <h3 className="widget-title">Liên kết</h3>
                <ul className="widget-contact">
                  <li className="widget-contact-item">
                    <a href="">
                      <i className="fa-regular fa-arrow-right"></i>
                      <span>Về chúng tôi</span>
                    </a>
                  </li>
                  <li className="widget-contact-item">
                    <a href="">
                      <i className="fa-regular fa-arrow-right"></i>
                      <span>Thực đơn</span>
                    </a>
                  </li>
                  <li className="widget-contact-item">
                    <a href="">
                      <i className="fa-regular fa-arrow-right"></i>
                      <span>Điều khoản</span>
                    </a>
                  </li>
                  <li className="widget-contact-item">
                    <a href="">
                      <i className="fa-regular fa-arrow-right"></i>
                      <span>Liên hệ</span>
                    </a>
                  </li>
                  <li className="widget-contact-item">
                    <a href="">
                      <i className="fa-regular fa-arrow-right"></i>
                      <span>Tin tức</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="widget-row-col">
                <h3 className="widget-title">Thực đơn</h3>
                <ul className="widget-contact">
                  <li className="widget-contact-item">
                    <a href="">
                      <i className="fa-regular fa-arrow-right"></i>
                      <span>Điểm tâm</span>
                    </a>
                  </li>
                  <li className="widget-contact-item">
                    <a href="">
                      <i className="fa-regular fa-arrow-right"></i>
                      <span>Món chay</span>
                    </a>
                  </li>
                  <li className="widget-contact-item">
                    <a href="">
                      <i className="fa-regular fa-arrow-right"></i>
                      <span>Món mặn</span>
                    </a>
                  </li>
                  <li className="widget-contact-item">
                    <a href="">
                      <i className="fa-regular fa-arrow-right"></i>
                      <span>Nước uống</span>
                    </a>
                  </li>
                  <li className="widget-contact-item">
                    <a href="">
                      <i className="fa-regular fa-arrow-right"></i>
                      <span>Tráng miệng</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="widget-row-col-1">
                <h3 className="widget-title">Liên hệ</h3>
                <div className="contact">
                  <div className="contact-item">
                    <div className="contact-item-icon">
                      <i className="fa-regular fa-location-dot"></i>
                    </div>
                    <div className="contact-content">
                      <span>
                        20/9 Trần Văn Ơn, Nguyễn Văn Cừ, Thành Phố Quy Nhơn
                      </span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-item-icon">
                      <i className="fa-regular fa-phone"></i>
                    </div>
                    <div className="contact-content contact-item-phone">
                      <span>0332766193</span>
                      {/* <br />
                    <span>0987 654 321</span> */}
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-item-icon">
                      <i className="fa-regular fa-envelope"></i>
                    </div>
                    <div className="contact-content conatct-item-email">
                      <span>tungccvv111@gmail.com</span>
                      <br />
                      {/* <span>infoabc@domain.com</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
