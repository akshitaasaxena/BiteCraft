const Food = require("../models/Fooditem.js");

const foodController = {
    getFoods: async (req, res) => {
        try {
            const foods = await Food.find();
            return res.json(foods);
        } catch (err) {
            console.error("getFoods error:", err);
            return res.status(500).json({
                message: "Failed to fetch food items"
            });
        }
    },

    getFoodById: async (req, res) => {
        try {
            const food = await Food.findById(req.params.id);

            if (!food) {
                return res.status(404).json({
                    message: "Food item not found"
                });
            }

            return res.json(food);
        } catch (err) {
            console.error("getFoodById error:", err);

            if (err.name === "CastError") {
                return res.status(400).json({
                    message: "Invalid food item ID"
                });
            }

            return res.status(500).json({
                message: "Failed to fetch food item"
            });
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

            if (
                !name?.trim() ||
                !category?.trim() ||
                price === undefined ||
                price === null ||
                price === ""
            ) {
                return res.status(400).json({
                    message: "Name, category and price are required"
                });
            }

            const numericPrice = Number(price);

            if (
                typeof name !== "string" ||
                typeof category !== "string" ||
                !Number.isFinite(numericPrice) ||
                numericPrice < 0 ||
                (available !== undefined && typeof available !== "boolean")
            ) {
                return res.status(400).json({
                    message: "Invalid food details"
                });
            }

            const food = await Food.create({
                name: name.trim(),
                category: category.trim(),
                price: numericPrice,
                description:
                    typeof description === "string" ? description.trim() : "",
                available: available !== undefined ? available : true,
                image: typeof image === "string" ? image : ""
            });

            return res.status(201).json({
                message: "Food item created successfully",
                food
            });
        } catch (err) {
            console.error("createFood error:", err);
            return res.status(500).json({
                message: "Failed to create food item"
            });
        }
    },

    updateFood: async (req, res) => {
        try {
            const {
                name,
                category,
                price,
                description,
                available,
                image
            } = req.body;

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
                (name !== undefined &&
                    (typeof name !== "string" || !name.trim())) ||
                (category !== undefined &&
                    (typeof category !== "string" || !category.trim())) ||
                (price !== undefined &&
                    (price === null ||
                        price === "" ||
                        !Number.isFinite(Number(price)) ||
                        Number(price) < 0)) ||
                (description !== undefined &&
                    typeof description !== "string") ||
                (available !== undefined &&
                    typeof available !== "boolean") ||
                (image !== undefined && typeof image !== "string")
            ) {
                return res.status(400).json({
                    message: "Invalid food details"
                });
            }

            const updateData = {};

            if (name !== undefined) updateData.name = name.trim();
            if (category !== undefined) updateData.category = category.trim();
            if (price !== undefined) updateData.price = Number(price);
            if (description !== undefined) {
                updateData.description = description.trim();
            }
            if (available !== undefined) updateData.available = available;
            if (image !== undefined) updateData.image = image;

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

            return res.json({
                message: "Food item updated successfully",
                food
            });
        } catch (err) {
            console.error("updateFood error:", err);

            if (err.name === "CastError") {
                return res.status(400).json({
                    message: "Invalid food item ID"
                });
            }

            return res.status(500).json({
                message: "Failed to update food item"
            });
        }
    },

    deleteFood: async (req, res) => {
        try {
            const deletedFood = await Food.findByIdAndDelete(req.params.id);

            if (!deletedFood) {
                return res.status(404).json({
                    message: "Food item not found"
                });
            }

            return res.json({
                message: "Food item deleted successfully"
            });
        } catch (err) {
            console.error("deleteFood error:", err);

            if (err.name === "CastError") {
                return res.status(400).json({
                    message: "Invalid food item ID"
                });
            }

            return res.status(500).json({
                message: "Failed to delete food item"
            });
        }
    }
};

module.exports = foodController;