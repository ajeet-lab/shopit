const express = require("express");
const router = express.Router();

const {
  addNewProduct,
  getAllProduct,
  getAllAdminProduct,
  singleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require("../controllers/productController");

const { isAuthenticate, authorizeRole } = require("../middlewares/auth");

router.get("/products", getAllProduct);

router.get("/product/:id", singleProduct);

// GET ALL PRODUCT --ADMIN
router.get(
  "/admin/products",
  isAuthenticate,
  authorizeRole("admin"),
  getAllAdminProduct
);

// ADD NEW PRODUCT --ADMIN
router
  .route("/admin/product/new")
  .post(isAuthenticate, authorizeRole("admin"), addNewProduct);

// UPDATE AND DELETE PRODUCT --ADMIN
router
  .route("/admin/product/:id")
  .put(isAuthenticate, authorizeRole("admin"), updateProduct)
  .delete(isAuthenticate, authorizeRole("admin"), deleteProduct);

router.route("/review").put(isAuthenticate, createProductReview);

module.exports = router;
