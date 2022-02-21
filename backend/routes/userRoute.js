const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getUserProfile,
    logout,
    updatePassword,
    updateProfile,
    getAllUser,
    getSpecificUser,
    updateSpecificUser,
    deleteSpecificUser
} = require("../controllers/authController");

const {
    isAuthenticate, authorizeRole
} = require("../middlewares/auth")


router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get('/me', isAuthenticate, getUserProfile);
router.put('/password/update', isAuthenticate, updatePassword);
router.put('/profile/update', isAuthenticate, updateProfile);

router.get('/users', isAuthenticate, authorizeRole("admin"), getAllUser);

router.route('/user/:id')
.get(isAuthenticate, authorizeRole("admin"), getSpecificUser)
.put(isAuthenticate, authorizeRole("admin"), updateSpecificUser)
.delete(isAuthenticate, authorizeRole("admin"), deleteSpecificUser);

module.exports = router;