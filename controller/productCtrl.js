const Product = require("../models/productModal");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

//create a new product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//update a product
const updateAProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id; 
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate({ _id: productId }, req.body, {new:true});
    if (!updateProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a product
const deleteAProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      const deleteProduct = await Product.findByIdAndDelete(id);
      res.json(deleteProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

//get a product
const getAProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//get all products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const getAllProducts = await Product.find();
    res.json(getAllProducts);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct, getAProduct, getAllProducts, updateAProduct, deleteAProduct };
