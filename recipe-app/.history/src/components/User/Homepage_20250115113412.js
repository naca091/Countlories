import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row, Spin, message, Input, Button } from 'antd';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import MenuDetailModal from './Menu/MenuDetailModal';
import MenuFilter from './Menu/MenuFilter';

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
    const handleClearFilter = () => {
        setFilterValues({
            totalCookingTimeMin: '',
            totalCookingTimeMax: '',
            difficulty: '',
            servingSizeMin: '',
            servingSizeMax: '',
            categoryId: '',
            caloriesMin: '',
            caloriesMax: ''
        });
        setFilteredMenus(menus);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Menu List</h1>
                <div className="flex items-center gap-4">
                    <span className="font-medium">Balance: {userXu} xu</span>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <Input.Search
                    placeholder="Search menu by name"
                    onSearch={handleSearch}
                    enterButton
                    className="w-full"
                />
                
                <MenuFilter
                    filterValues={filterValues}
                    setFilterValues={setFilterValues}
                    categories={categories}
                    onFilter={handleFilter}
                    onClearFilter={handleClearFilter}
                />
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredMenus.map((menu) => (
                        <div 
                            key={menu._id}
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleMenuClick(menu)}
                        >
                            <img 
                                src={menu.image} 
                                alt={menu.name} 
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-medium text-lg">{menu.name}</h3>
                                <p className="text-gray-600">
                                    {purchasedMenus.includes(menu._id) 
                                        ? "Unlocked" 
                                        : `Unlock Price: ${menu.unlockPrice} xu`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
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
