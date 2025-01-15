import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row, Spin, message, Input, Button } from 'antd';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import MenuDetailModal from './Menu/MenuDetailModal';

const Homepage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { userEmail, userxu: initialUserXu } = state || { userEmail: '', userxu: 0 };

    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userXu, setUserXu] = useState(initialUserXu);
    const [user, setUser] = useState({}); // Lưu thông tin người dùng
    const [purchasedMenus, setPurchasedMenus] = useState([]);
    const [filterValues, setFilterValues] = useState({
        totalCookingTimeMin: '',
        totalCookingTimeMax: '',
        difficulty: '',
        servingSizeMin: '',
        servingSizeMax: '',
        categoryId: '',
        caloriesMin: '',
        caloriesMax: ''
    });
    const categories = React.useMemo(() => {
        const uniqueCategories = new Set();
        menus.forEach(menu => {
            if (menu.category && menu.category._id && menu.category.name) {
                uniqueCategories.add(JSON.stringify(menu.category));
            }
        });
        return Array.from(uniqueCategories).map(cat => JSON.parse(cat));
    }, [menus]);
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get('http://localhost:5000/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        setUser(response.data.user);
                        setUserXu(response.data.user.xu);
                        setPurchasedMenus(response.data.user.purchasedMenus.map(pm => pm.menuId));
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                message.error('Failed to load user data');
            }
        };

        const fetchMenus = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/menus');
                if (response.data.success) {
                    setMenus(response.data.data);
                    setFilteredMenus(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching menus:', error);
                message.error('Failed to load menus');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchMenus();
    }, []);

    const handleSearch = (value) => {
        const searchValue = value.toLowerCase();
        const filtered = menus.filter((menu) =>
            menu.name.toLowerCase().includes(searchValue)
        );
        setFilteredMenus(filtered);
    };
    //logout function 
    const handleLogout = () => {
        localStorage.removeItem('token'); // Xóa thông tin người dùng từ localStorage
        navigate('/login'); // Điều hướng về trang đăng nhập
    };

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

    const navigateToProfile = () => {
        navigate('/user/profile', { state: { user } });
    };

    const navigateToSeeAds = () => {
        navigate('/user/see-video   ', { state: { user } });
    };

     // Filter function
     const handleFilter = () => {
        const filtered = menus.filter(menu => {
            // Calculate total cooking time
            const totalCookingTime = menu.cookingTime.prep + menu.cookingTime.cook;
            
            // Total Cooking Time Filter
            if (filterValues.totalCookingTimeMin && 
                totalCookingTime < Number(filterValues.totalCookingTimeMin)) return false;
            if (filterValues.totalCookingTimeMax && 
                totalCookingTime > Number(filterValues.totalCookingTimeMax)) return false;
            
            // Difficulty Filter
            if (filterValues.difficulty && menu.difficulty !== filterValues.difficulty) return false;
            
            // Serving Size Filter
            if (filterValues.servingSizeMin && 
                menu.servingSize < Number(filterValues.servingSizeMin)) return false;
            if (filterValues.servingSizeMax && 
                menu.servingSize > Number(filterValues.servingSizeMax)) return false;
            
            // Category Filter
            if (filterValues.categoryId && menu.category._id !== filterValues.categoryId) return false;
            
            // Calories Filter
            if (filterValues.caloriesMin && 
                menu.calories < Number(filterValues.caloriesMin)) return false;
            if (filterValues.caloriesMax && 
                menu.calories > Number(filterValues.caloriesMax)) return false;
            
            return true;
        });
        
        setFilteredMenus(filtered);
    };

    return (
        <div className="homepage">
            <h1>Menu List</h1>
            <div>
                <strong>User: {userEmail}</strong>
                <strong>Balance: {userXu} xu</strong>
                <Button type="primary" danger onClick={handleLogout}>
                    Logout
                </Button>
            </div>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Input.Search
                    placeholder="Search menu by name"
                    onSearch={handleSearch}
                    enterButton
                    style={{ width: '60%' }}
                />
                <div>
                    <strong>Balance: {userXu} xu</strong>
                </div>
                <Button type="primary" onClick={navigateToProfile}>
                    Go to Profile
                </Button>

                <Button type="primary" onClick={navigateToSeeAds}>
                    See Video Ads
                </Button>
            </div>

            {loading ? (
                <Spin size="large" />
            ) : (
                <Row gutter={[16, 16]}>
                    {filteredMenus.map((menu) => (
                        <Col span={8} key={menu._id}>
                            <Card
                                hoverable
                                cover={<img alt={menu.name} src={menu.imageUrl} />}
                                onClick={() => handleMenuClick(menu)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Card.Meta
                                    title={menu.name}
                                    description={
                                        purchasedMenus.includes(menu._id) ?
                                            "Unlocked" :
                                            `Unlock Price: ${menu.unlockPrice} xu`
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
        </div>
    );
};

export default Homepage;
