import React, { useState, useCallback } from 'react';  
import { Modal, Button, message, Skeleton, Typography, Divider } from 'antd';  
import { UnlockOutlined, LockOutlined } from '@ant-design/icons';  
import authUtils from '../authUtils';  

const { Title, Text } = Typography;  

const MenuDetailModal = ({ menu, visible, onClose, userXu, onPurchaseSuccess }) => {  
  const [loading, setLoading] = useState(false);  
  const [menuStatus, setMenuStatus] = useState({  
    isUnlocked: menu?.defaultStatus === 'unlock',  
  });  

  const authAxios = authUtils.createAuthAxios();  

  const handlePurchase = useCallback(async () => {  
    if (!menu?._id) {  
      message.error('Invalid menu.');  
      return;  
    }  

    try {  
      setLoading(true);  

      const response = await authAxios.post('/api/menus/purchase', {  
        menuId: menu._id,  
      });  

      if (response.data.success) {  
        message.success('Menu unlocked successfully!');  
        setMenuStatus({ isUnlocked: true });  
        onPurchaseSuccess?.(response.data.remainingXu);  
      }  
    } catch (error) {  
      console.error('Error purchasing menu:', error);  
      const errorMsg =  
        error.response?.data?.message || 'An error occurred while purchasing the menu.';  
      message.error(errorMsg);  

      if (error.response?.status === 403) {  
        onClose();  
      }  
    } finally {  
      setLoading(false);  
    }  
  }, [menu, authAxios, onPurchaseSuccess, onClose]);  

  const renderMenuContent = useCallback(() => {  
    if (!menu) return <Skeleton active />;  

    return menuStatus.isUnlocked ? (  
      <div className="space-y-4">  
        <img src={menu.image} alt={menu.name} className="w-full rounded-lg object-cover h-64" />  
        <div className="mt-4">  
          <Title level={3}>{menu.name}</Title>  
          <Divider />  
          <Text type="secondary">{menu.description}</Text>  
          <Divider />  
          <div className="grid grid-cols-2 gap-4">  
            <div>  
              <Text strong>Cooking Time:</Text>  
              <Text> {menu.cookingTime} minutes</Text>  
            </div>  
            <div>  
              <Text strong>Difficulty:</Text>  
              <Text> {menu.difficulty}</Text>  
            </div>  
            <div>  
              <Text strong>Serving Size:</Text>  
              <Text> {menu.servingSize}</Text>  
            </div>  
            <div>  
              <Text strong>Calories:</Text>  
              <Text> {menu.calories}</Text>  
            </div>  
            <div>  
              <Text strong>Nutritional Info:</Text>  
              <Text> {menu.nutritionalInfo}</Text>  
            </div>  
            <div>  
              <Text strong>Unlock Price:</Text>  
              <Text> {menu.unlockPrice} xu</Text>  
            </div>  
            <div>  
              <Text strong>Average Rating:</Text>  
              <Text> {menu.averageRating}</Text>  
            </div>  
          </div>  
        </div>  
      </div>  
    ) : (  
      <div className="relative">  
        <img  
          src={menu.image}  
          alt={menu.name}  
          className="w-full h-64 object-cover rounded-lg filter blur-sm"  
        />  
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30">  
          <LockOutlined className="text-2xl text-white mb-2" />  
          <Text className="text-white font-medium">Unlock this menu to view full details</Text>  
        </div>  
      </div>  
    );  
  }, [menu, menuStatus.isUnlocked]);  

  return (  
    <Modal  
      title={null}  
      visible={visible}  
      onCancel={onClose}  
      footer={[  
        <Button key="close" onClick={onClose}>  
          Close  
        </Button>,  
        !menuStatus.isUnlocked && (  
          <Button  
            key="unlock"  
            type="primary"  
            icon={<UnlockOutlined />}  
            onClick={handlePurchase}  
            loading={loading}  
            disabled={userXu < (menu?.unlockPrice || 0)}  
          >  
            Unlock ({menu?.unlockPrice} xu)  
          </Button>  
        ),  
      ]}  
      width={800}  
      destroyOnClose  
    >  
      {renderMenuContent()}  
    </Modal>  
  );  
};  

export default MenuDetailModal;