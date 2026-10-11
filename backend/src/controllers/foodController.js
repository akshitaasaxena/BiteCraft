const Food = require("../models/Fooditem.js");
const mongoose = require("mongoose");

const foodController = {
    getFoods: async (req, res) => {
        const foods = await Food.find();
        res.json(foods);
    },
    getFoodById: async (req, res) => {
        res.status(501).json({ message: "Not implemented" });
    },
    createFood: async (req, res) => {
        res.status(501).json({ message: "Not implemented" });
    },
    updateFood: async (req, res) => {
        res.status(501).json({ message: "Not implemented" });
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