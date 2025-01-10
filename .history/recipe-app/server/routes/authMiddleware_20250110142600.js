// middlewares/authMiddleware.js  
const jwt = require('jsonwebtoken');  
const User = require('../models/models');  


// Middleware xác thực token  
const authenticateToken = (req, res, next) => {  
    const authHeader = req.headers['authorization'];  
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header  

    if (!token) {  
        return res.sendStatus(401); // Nếu không có token, trả về Unauthorized  
    }  

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {  
        if (err) {  
            return res.status(403).json({ success: false, message: 'Unauthorized: Invalid token' });  
        }  
        req.user = user; // Lưu thông tin người dùng vào req cho các middleware khác  
        next(); // Gọi hàm tiếp theo  
    });  
};  

module.exports = authenticateToken;