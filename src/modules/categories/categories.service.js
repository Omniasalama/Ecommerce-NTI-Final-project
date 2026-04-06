/** @format */
import { categoryModel } from "../../database/model/category.model.js";
import { subcategoryModel } from "../../database/model/subcategoriesModel.js";
import { uploadImage } from "../../common/cloudinary/cloudinary.config.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const found = await categoryModel.findOne({ name, isDeleted: false });
    if (found) return res.status(400).json({ message: "Category already exists" });

    let imageUrl = "";
    if (req.file) {
      const result = await uploadImage(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const category = await categoryModel.create({ name, image: imageUrl });
    return res.status(201).json({ message: "Category created", category });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel
      .find({ isDeleted: false })
      .populate({
        path: "subcategories",
        match: { isDeleted: false },
      });

    return res.status(200).json({ message: "Success", categories });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findOne({ _id: id, isDeleted: false });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const { name } = req.body;
    if (name) category.name = name;

    if (req.file) {
      const result = await uploadImage(req.file.buffer);
      category.image = result.secure_url;
    }

    await category.save();
    return res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findOne({ _id: id, isDeleted: false });
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.isDeleted = true;
    category.deletedAt = Date.now();
    await category.save();

    return res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getAllActiveCategories = async (req, res) => {
  try {
    const categories = await categoryModel
      .find({ isDeleted: false })
      .select("name image") 
      .populate({
        path: "subcategories",
        match: { isDeleted: false },
        select: "name",
      });

    return res.status(200).json({
      message: "Success",
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel
      .findOne({ _id: id, isDeleted: false })
      .populate({
        path: "subcategories",
        match: { isDeleted: false },
        select: "name description",
      });

    if (!category) return res.status(404).json({ message: "Category not found" });

    return res.status(200).json({
      message: "Success",
      category: {
        id: category._id,
        name: category.name,
        subcategories: category.subcategories,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};