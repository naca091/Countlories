const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Menu, Category, Ingredient } = require("../models/models");
const authController = require("../routes/authService");
const menuController = require("../controllers/menuController");  
// Cấu hình multer để lưu file vào thư mục "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Đường dẫn tuyệt đối đến thư mục uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
  },
});



const upload = multer({ storage });

// Endpoint để upload file
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    console.log("Request file:", req.file); // Log file được gửi lên
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    res.json({
      success: true,
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("Error uploading file:", error); // Log lỗi chi tiết
    res.status(500).json({ success: false, message: "Something broke!" });
  }
});


// Create menu
router.post("/api/menus", async (req, res) => {
  try {
    const {
      name,
      ingredients,
      description,
      cookingTime,
      difficulty,
      servingSize,
      defaultStatus,
      category,
      tags,
      image,
      calories,
      nutritionalInfo,
      unlockPrice,
      averageRating,
      isActive,
    } = req.body;

    // Validation
    if (
      !name ||
      !ingredients ||
      !description ||
      !cookingTime ||
      !difficulty ||
      !servingSize ||
      !defaultStatus ||
      !category ||
      !tags ||
      !image ||
      !calories ||
      !nutritionalInfo ||
      !unlockPrice ||
      !averageRating ||
      isActive === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if all ingredients exist
    const ingredientIds = ingredients.map((ing) => ing.ingredient);
    const existingIngredients = await Ingredient.find({
      _id: { $in: ingredientIds },
    });
    if (existingIngredients.length !== ingredientIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some ingredients not found",
      });
    }

    // Create menu
    const menu = new Menu({
      name,
      ingredients: ingredients.map((ing) => ({
        ingredient: ing.ingredient,
        weight: ing.weight,
        unit: ing.unit,
      })),
      description,
      cookingTime,
      difficulty,
      servingSize,
      defaultStatus,
      category,
      tags,
      image,
      calories,
      nutritionalInfo,
      unlockPrice,
      averageRating,
      isActive,
    });

    await menu.save();
    res.status(201).json({
      success: true,
      message: "Menu created successfully",
      data: menu,
    });
  } catch (error) {
    console.error("Error creating menu:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Get all menus
router.get("/api/menus", async (req, res) => {
  try {
    const menus = await Menu.find().sort({ name: 1 });
    res.json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching menus",
      error: error.message,
    });
  }
});

// Get single menu by ID
router.get("/api/menus/:id", async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }
    res.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching menu",
      error: error.message,
    });
  }
});

// Update menu by ID
router.put("/api/menus/:id", async (req, res) => {
  try {
    const {
      name,
      ingredients,
      description,
      cookingTime,
      difficulty,
      servingSize,
      defaultStatus,
      category,
      tags,
      image,
      calories,
      nutritionalInfo,
      unlockPrice,
      averageRating,
      isActive,
    } = req.body;

    // Check if menu exists
    const existingMenu = await Menu.findById(req.params.id);
    if (!existingMenu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }

    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if all ingredients exist
    const ingredientIds = ingredients.map((ing) => ing.ingredient);
    const existingIngredients = await Ingredient.find({
      _id: { $in: ingredientIds },
    });
    if (existingIngredients.length !== ingredientIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some ingredients not found",
      });
    }

    // Update menu
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        name,
        ingredients: ingredients.map((ing) => ({
          ingredient: ing.ingredient,
          weight: ing.weight,
          unit: ing.unit,
        })),
        description,
        cookingTime,
        difficulty,
        servingSize,
        defaultStatus,
        category,
        tags,
        image,
        calories,
        nutritionalInfo,
        unlockPrice,
        averageRating,
        isActive,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Menu updated successfully",
      data: updatedMenu,
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({
      success: false,
      message: "Error updating menu",
      error: error.message,
    });
  }
});

// Delete menu by ID
router.delete("/api/menus/:id", async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }
    res.json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting menu",
      error: error.message,
    });
  }
});

// Endpoint để tạo menu
router.post("/", async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json({ success: true, data: menu });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Endpoint để lấy danh sách menu
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find().populate("category").populate("ingredients.ingredient");
    res.json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// routes/menuRoutes.js
app.post('/api/menus/purchase', authMiddleware, async (req, res) => {  
  const { menuId } = req.body; // Lấy menuId thay vì name
  const userId = req.user.userId; // Lấy từ decoded token

  if (!userId || !menuId) {  
      return res.status(400).json({ 
          success: false, 
          message: 'User ID hoặc menu ID bị thiếu.' 
      });  
  }  

  try {  
      // Tìm menu bằng ID
      const menu = await Menu.findById(menuId);
      // Tìm user hiện tại
      const currentUser = await User.findById(userId);

      if (!menu) {  
          return res.status(404).json({ 
              success: false, 
              message: 'Menu không tồn tại.' 
          });  
      }  

      // Kiểm tra số xu
      if (currentUser.xu < menu.unlockPrice) {  
          return res.status(400).json({ 
              success: false, 
              message: 'Không đủ xu để mua menu.' 
          });  
      }  

      // Kiểm tra đã mua chưa
      if (!menu.purchasedBy.includes(userId)) {  
          // Trừ xu và thêm vào purchasedBy
          currentUser.xu -= menu.unlockPrice;  
          menu.purchasedBy.push(userId);  

          await currentUser.save();  
          await menu.save();  

          return res.json({ 
              success: true, 
              message: 'Mua menu thành công!',
              remainingXu: currentUser.xu 
          });  
      } else {  
          return res.status(400).json({ 
              success: false, 
              message: 'Bạn đã mua menu này rồi.' 
          });  
      }  
  } catch (error) {  
      console.error('Error purchasing menu:', error);  
      return res.status(500).json({ 
          success: false, 
          message: 'Lỗi khi mua menu.' 
      });  
  }  
});

module.exports = router;