/** @format */

import { productModel } from "../../database/model/productModel.js";
import { uploadImage } from "../../common/cloudinary/cloudinary.config.js";
import { categoryModel } from "../../database/model/category.model.js";
import { subcategoryModel } from "../../database/model/subcategoriesModel.js";

const pagefilter = (query) => {
  const filters = { isDeleted: false };

  if (query.categoryId) filters.category = query.categoryId;
  if (query.subcategoryId) filters.subcategory = query.subcategoryId;

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filters.price = {};
    if (query.minPrice !== undefined)
      filters.price.$gte = Number(query.minPrice);
    if (query.maxPrice !== undefined)
      filters.price.$lte = Number(query.maxPrice);
  }

  return filters;
};

export const addProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, subcategory } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const foundCategory = await categoryModel.findOne({
      _id: category,
      isDeleted: false,
    });
    if (!foundCategory)
      return res.status(404).json({ message: "Category not found" });

    const foundSubcategory = await subcategoryModel.findOne({
      _id: subcategory,
      isDeleted: false,
    });
    if (!foundSubcategory)
      return res.status(404).json({ message: "Subcategory not found" });

    let imageUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const result = await uploadImage(file.buffer);
        imageUrls.push(result.secure_url);
      }
    }

    const product = await productModel.create({
      name,
      description,
      price,
      stock,
      category,
      subcategory,
      images: imageUrls,
    });

    return res.status(201).json({ message: "Product created", product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.files && req.files.length > 0) {
      const images = [];
      for (const file of req.files) {
        const result = await uploadImage(file.buffer);
        images.push(result.secure_url);
      }
      updates.images = images;
    }

    const product = await productModel.findOne({ _id: id, isDeleted: false });
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, updates);
    await product.save();

    return res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findOne({ _id: id, isDeleted: false });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();

    return res.status(200).json({ message: "Product soft deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0)
      return res.status(400).json({ message: "Stock must be >= 0" });

    const product = await productModel.findOne({ _id: id, isDeleted: false });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.stock = stock;
    await product.save();

    return res.status(200).json({ message: "Stock updated", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort } = req.query;
    const filters = pagefilter(req.query);

    let sortOption = {};
    if (sort) {
      const [field, order] = sort.split("_");
      sortOption[field] = order === "asc" ? 1 : -1;
    } else {
      sortOption.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const products = await productModel
      .find(filters)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate("category", "name")
      .populate("subcategory", "name");

    const total = await productModel.countDocuments(filters);

    return res.status(200).json({
      message: "Success",
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      products,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel
      .findOne({ _id: id, isDeleted: false })
      .populate("category", "name")
      .populate("subcategory", "name");

    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({ message: "Success", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    req.query.categoryId = req.params.categoryId;
    return getAllProducts(req, res);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getProductsBySubcategory = async (req, res) => {
  try {
    req.query.subcategoryId = req.params.subcategoryId;
    return getAllProducts(req, res);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
