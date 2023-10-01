const router = require("express").Router();
const authController = require("../../controller/authController");
const authValidator = require("../../utilities/validations/authValidation");
const checkUserToken = require("../../utilities/tokenmanager/checkUserToken");
const applyUploader = require("../../uploads/applyUploder");
const UserController = require("../../controller/userController");
const checkAdminToken = require("../../utilities/tokenmanager/checkAdminToken");

router.post("/register", authController.register);
router.post("/login", authController.login);


router.post("/send_otp", authValidator.check_user, authController.send_otp);
// router.post("/verify_otp", authValidator.otp_verify, authController.otp_verify);
router.post(
    "/details/add",
    checkUserToken,
    applyUploader,
    authValidator.details_add,
    UserController.details_add
);
router.post("/block", checkAdminToken, UserController.block);
router.post("/delete", checkAdminToken, UserController.delete);
router.post("/list", checkAdminToken, UserController.list);
router.post("/details", UserController.details);

router.post("/enc", UserController.enc);

module.exports = router;
