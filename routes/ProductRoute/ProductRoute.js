const router = require("express").Router();
const ProductController = require("../../controller/productController");
const productUploader = require("../../uploads/productUploader");
const checkAdminToken = require("../../utilities/tokenmanager/checkAdminToken");
const checkPermission = require("../../utilities/tokenmanager/checkpermission");

router.post(
    "/create",
    checkAdminToken,
    productUploader,
    ProductController.create
);
router.post("/list", checkPermission, ProductController.list);
router.post("/details", checkPermission, ProductController.details);
router.post(
    "/update",
    checkAdminToken,
    productUploader,
    ProductController.update
);
router.post("/delete", checkPermission, ProductController.delete);

module.exports = router;
