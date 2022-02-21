const Product = require("../models/Product");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const asyncHandler = require("../middlewares/catchAsyncHandler");
const ApiFeature = require("../utils/ApiFeaturer");
const cloudinary = require("cloudinary");

// Add new products --Admin => /api/v1/admin/product/new
exports.addNewProduct = asyncHandler(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  let imageLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imageLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imageLinks;
  req.body.user = req.user._id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products with seach, filter and pegination - /api/v1/products
exports.getAllProduct = asyncHandler(async (req, res, next) => {
  const productsCount = await Product.find({}).countDocuments();
  const resPerPage = 4;
  let apiFeatures = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  let products = await apiFeatures.query;

  let filteredProductCount = products.length;

  if (!products) {
    return next(new CustomErrorHandler("Products not found..", 400));
  }
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resPerPage,
    filteredProductCount,
  });
});

// Get all products with seach, filter and pegination - /api/v1/admin/products
exports.getAllAdminProduct = asyncHandler(async (req, res, next) => {
  let products = await Product.find();
  if (!products) {
    return next(new CustomErrorHandler("Products not found..", 400));
  }
  res.status(200).json({
    success: true,
    products,
  });
});

// Get single products - /api/v1/product/:id
exports.singleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new CustomErrorHandler("Product not found..", 400));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// Update products - /api/v1/admin/product/:id
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    return next(new CustomErrorHandler("Product not found..", 400));
  }
  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    returnDocument: "after",
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// Delete products - /api/v1/admin/product/:id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    return next(new CustomErrorHandler("Product not found..", 400));
  }

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product is deleted"
  });
});

exports.createProductReview = asyncHandler(async (req, res, next) => {
  const { comment, rating, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    comment,
    rating: Number(rating),
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
