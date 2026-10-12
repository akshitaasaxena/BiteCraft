const Food = require("../models/Fooditem.js");
const mongoose = require("mongoose");

const foodController = {
    getFoods: async (req, res) => {
        const foods = await Food.find();
        res.json(foods);
    },
    getFoodById: async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid food item ID" });
        }

        try {
            const food = await Food.findById(req.params.id);

            if (!food) {
                return res.status(404).json({ message: "Food item not found" });
            }

            return res.status(200).json(food);
        } catch (error) {
            return res.status(500).json({ message: "Failed to get food item" });
        }
    },
    createFood: async (req, res) => {
        try {
            const {
                name,
                category,
                price,
                description,
                available,
                image
            } = req.body;

            if (!name || !category || price === undefined) {
                return res.status(400).json({
                    message: "Name, category and price are required"
                });
            }

            if (typeof price !== "number" || isNaN(price) || price < 0) {
                return res.status(400).json({
                    message: "Price must be a valid non-negative number"
                });
            }

            if (
                typeof name !== "string" ||
                !name.trim() ||
                typeof category !== "string" ||
                !category.trim() ||
                (available !== undefined && typeof available !== "boolean") ||
                (description !== undefined && typeof description !== "string") ||
                (image !== undefined && typeof image !== "string")
            ) {
                return res.status(400).json({
                    message: "Invalid food details"
                });
            }

            const food = await Food.create({
                name: name.trim(),
                category: category.trim(),
                price,
                description: description ? description.trim() : "",
                available: available !== undefined ? available : true,
                image: image ? image.trim() : ""
            });

            return res.status(201).json(food);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Failed to create food"
            });
        }
    },
    updateFood: async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid food item ID" });
        }

        try {
            const { name, category, price, description, available, image } = req.body;

            if (
                name === undefined &&
                category === undefined &&
                price === undefined &&
                description === undefined &&
                available === undefined &&
                image === undefined
            ) {
                return res.status(400).json({
                    message: "At least one field is required"
                });
            }

            if (price !== undefined && (typeof price !== "number" || isNaN(price) || price < 0)) {
                return res.status(400).json({
                    message: "Price must be a valid non-negative number"
                });
            }

            if (
                (name !== undefined && (typeof name !== "string" || !name.trim())) ||
                (category !== undefined && (typeof category !== "string" || !category.trim())) ||
                (available !== undefined && typeof available !== "boolean") ||
                (description !== undefined && typeof description !== "string") ||
                (image !== undefined && typeof image !== "string")
            ) {
                return res.status(400).json({
                    message: "Invalid food details"
                });
            }

            const updateData = {};
            if (name !== undefined) updateData.name = name.trim();
            if (category !== undefined) updateData.category = category.trim();
            if (price !== undefined) updateData.price = price;
            if (description !== undefined) updateData.description = description.trim();
            if (available !== undefined) updateData.available = available;
            if (image !== undefined) updateData.image = image.trim();

            const food = await Food.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!food) {
                return res.status(404).json({
                    message: "Food item not found"
                });
            }

            return res.status(200).json(food);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Failed to update food"
            });
        }
    },
    deleteFood: async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid food item ID" });
        }

        try {
            const deletedFood = await Food.findByIdAndDelete(req.params.id);

            if (!deletedFood) {
                return res.status(404).json({ message: "Food item not found" });
            }

            return res.status(200).json({ message: "Food item deleted successfully" });
        } catch (error) {
            console.error(error);

            return res.status(500).json({ message: "Failed to delete food item" });
        }
    }
};

module.exports = foodController;