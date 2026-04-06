/** @format */
import { subcategoryModel } from "../../database/model/subcategoriesModel.js";
import { categoryModel } from "../../database/model/category.model.js";
import { uploadImage } from "../../common/cloudinary/cloudinary.config.js";

export const createSubcategory = async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;

    const category = await categoryModel.findOne({
      _id: categoryId,
      isDeleted: false,
    });
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    let imageUrl = "";
    if (req.file) {
      const result = await uploadImage(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const subcategory = await subcategoryModel.create({
      name,
      description,
      category: categoryId,
      image: imageUrl,
    });

    return res
      .status(201)
      .json({ message: "Subcategory created", subcategory });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await subcategoryModel
      .find({ isDeleted: false })
      .populate({ path: "category", select: "name" });

    return res.status(200).json({ message: "Success", subcategories });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await subcategoryModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!subcategory)
      return res.status(404).json({ message: "Subcategory not found" });

    const { name, description, categoryId } = req.body;
    if (name) subcategory.name = name;
    if (description) subcategory.description = description;
    if (categoryId) subcategory.category = categoryId;

    await subcategory.save();
    return res
      .status(200)
      .json({ message: "Subcategory updated", subcategory });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await subcategoryModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!subcategory)
      return res.status(404).json({ message: "Subcategory not found" });

    subcategory.isDeleted = true;
    subcategory.deletedAt = Date.now();
    await subcategory.save();

    return res.status(200).json({ message: "Subcategory deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getSubcategoryDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await subcategoryModel
      .findOne({ _id: id, isDeleted: false })
      .populate({ path: "category", select: "name" });

    if (!subcategory)
      return res.status(404).json({ message: "Subcategory not found" });

    return res.status(200).json({
      message: "Success",
      subcategory: {
        id: subcategory._id,
        name: subcategory.name,
        description: subcategory.description,
        category: subcategory.category ? subcategory.category.name : null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
