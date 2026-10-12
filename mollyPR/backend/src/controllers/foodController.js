const Food = require("../models/Fooditem.js");

const foodController = {
    getFoods: async (req, res) => {
        try {
            const foods = await Food.find();
            res.json(foods);
        } catch (err) {
            console.error("getFoods error:", err);
            res.status(500).json({ message: "Failed to fetch food items" });
        }
    },

    getFoodById: async (req, res) => {
        try {
            const food = await Food.findById(req.params.id);
            if (!food) {
                return res.status(404).json({ message: "Food item not found" });
            }
            res.json(food);
        } catch (err) {
            console.error("getFoodById error:", err);
            res.status(500).json({ message: "Failed to fetch food item" });
        }
    },

    createFood: async (req, res) => {
        try {
            const { name, category, price, description, available, image } = req.body;

            if (!name || price === undefined) {
                return res.status(400).json({ message: "Food name and price are required" });
            }

            const newFood = new Food({
                name: name.trim(),
                category: category?.trim() || "General",
                price: Number(price),
                description: description?.trim() || "",
                available: available !== undefined ? Boolean(available) : true,
                image: image || ""
            });

            const savedFood = await newFood.save();
            res.status(201).json({
                message: "Food item created successfully",
                food: savedFood
            });
        } catch (err) {
            console.error("createFood error:", err);
            res.status(500).json({ message: "Failed to create food item" });
        }
    },

    updateFood: async (req, res) => {
        try {
            const { name, category, price, description, available, image } = req.body;

            const updateData = {};
            if (name !== undefined) updateData.name = name.trim();
            if (category !== undefined) updateData.category = category.trim();
            if (price !== undefined) updateData.price = Number(price);
            if (description !== undefined) updateData.description = description.trim();
            if (available !== undefined) updateData.available = Boolean(available);
            if (image !== undefined) updateData.image = image;

            const updatedFood = await Food.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedFood) {
                return res.status(404).json({ message: "Food item not found" });
            }

            res.json({
                message: "Food item updated successfully",
                food: updatedFood
            });
        } catch (err) {
            console.error("updateFood error:", err);
            res.status(500).json({ message: "Failed to update food item" });
        }
    },

    deleteFood: async (req, res) => {
        try {
            const deletedFood = await Food.findByIdAndDelete(req.params.id);
            if (!deletedFood) {
                return res.status(404).json({ message: "Food item not found" });
            }

            res.json({ message: "Food item deleted successfully" });
        } catch (err) {
            console.error("deleteFood error:", err);
            res.status(500).json({ message: "Failed to delete food item" });
        }
    }
};

module.exports = foodController;