const express = require('express');
const router = express.Router();
const { Role } = require('../models/models');

// Logging middleware for all category routes
router.use((req, res, next) => {
    debug(`${req.method} ${req.originalUrl}`);
    debug('Request body:', req.body);
    next();
});

// Get all categories
router.get('/api/roles', async (req, res) => {
    try {
        debug('Fetching all roles');
        const categories = await Category.find().sort({ name: 1 });
        debug(`Found ${categories.length} roles`);
        
        res.json({
            success: true,
            count: roles.length,
            data: roles
        });
    } catch (error) {
        debug('Error fetching roles:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching roles',
            error: error.message 
        });
    }
});

// Get single roles
router.get('/api/roles/:id', async (req, res) => {
    try {
        debug('Fetching roles with id:', req.params.id);
        const role = await Role.findById(req.params.id);
        
        if (!role) {
            debug('Role not found');
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }
        
        debug('Found Role:', role);
        res.json({
            success: true,
            data: role
        });
    } catch (error) {
        debug('Error fetching role:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching role',
            error: error.message
        });
    }
});

// Create role
router.post('/api/roles', async (req, res) => {
    try {
        debug('Creating new role with data:', req.body);
        const { name } = req.body;  // Chỉ lấy name từ request

        // Validation
        if (!name) {
            debug('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        // Check for existing category
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            debug('Role already exists:', name);
            return res.status(400).json({
                success: false,
                message: 'Role already exists'
            });
        }

        // Chỉ tạo với field name
        const role = new Role({ name });

        await role.save();
        debug('Role created successfully:', role);
        
        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: role
        });
    } catch (error) {
        debug('Error creating role:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating role',
            error: error.message
        });
    }
});

// Update role
router.put('/api/roles/:id', async (req, res) => {
    try {
        debug('Updating role with id:', req.params.id);
        debug('Update data:', req.body);
        
        const { name} = req.body;

        if (name) {
            const existingRole = await Role.findOne({
                name,
                _id: { $ne: req.params.id }
            });

            if (existingRole) {
                debug('Role name already exists:', name);
                return res.status(400).json({
                    success: false,
                    message: 'Role name already exists'
                });
            }
        }

        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { name},
            { new: true, runValidators: true }
        );

        if (!category) {
            debug('Role not found for update');
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        debug('Role updated successfully:', role);
        res.json({
            success: true,
            message: 'Role updated successfully',
            data: role
        });
    } catch (error) {
        debug('Error updating role:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating role',
            error: error.message
        });
    }
});

// Delete role
router.delete('/api/role/:id', async (req, res) => {
    try {
        debug('Deleting role with id:', req.params.id);
        
        const role = await Role.findByIdAndDelete(req.params.id);
        
        if (!role) {
            debug('Role not found for deletion');
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        debug('Role deleted successfully');
        res.json({
            success: true,
            message: 'Role deleted successfully'
        });
    } catch (error) {
        debug('Error deleting role:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
});

module.exports = router;