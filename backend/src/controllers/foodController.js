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
        res.status(501).json({ message: "Not implemented" });
    },
    updateFood: async (req, res) => {
        res.status(501).json({ message: "Not implemented" });
    },
    deleteFood: async (req, res) => {
        res.status(501).json({ message: "Not implemented" });
    }
};

module.exports = foodController;