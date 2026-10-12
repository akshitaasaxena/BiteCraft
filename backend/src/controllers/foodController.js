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

            if (
                typeof name !== "string" ||
                typeof category !== "string" ||
                typeof price !== "number" ||
                price < 0 ||
                (available !== undefined && typeof available !== "boolean")
            ) {
                return res.status(400).json({
                    message: "Invalid food details"
                });
            }

            const food = await Food.create({
                name,
                category,
                price,
                description,
                available,
                image
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

            if (
                (name !== undefined && typeof name !== "string") ||
                (category !== undefined && typeof category !== "string") ||
                (price !== undefined && (typeof price !== "number" || price < 0)) ||
                (available !== undefined && typeof available !== "boolean")
            ) {
                return res.status(400).json({
                    message: "Invalid food details"
                });
            }

            const food = await Food.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
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
        const id = req.params.id;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid food item ID" });
        }

        try {
            const deletedFood = await Food.findByIdAndDelete(id);

            if (!deletedFood) {
                return res.status(404).json({ message: "Food item not found" });
            }

            return res.json({ message: "Food item deleted successfully" });
        } catch {
            return res.status(500).json({ message: "Failed to delete food item" });
        }
    }
};

module.exports = foodController;