const router = require("express").Router();
const ProductController = require("../../controller/productController");
const brandUploader = require("../../uploads/brandUploader");
const productUploader = require("../../uploads/productUploader");
const checkAdminToken = require("../../utilities/tokenmanager/checkAdminToken");
const checkPermission = require("../../utilities/tokenmanager/checkpermission");

router.post(
    "/create",
    // checkAdminToken,
    productUploader,
    ProductController.create
);
router.post("/brand/create", brandUploader, ProductController.createBrand);
router.post("/list", ProductController.list);
router.post("/brand/list", ProductController.brand_list);
router.post("/details", checkPermission, ProductController.details);
router.post(
    "/update",
    checkAdminToken,
    productUploader,
    ProductController.update
);
router.post("/delete", checkPermission, ProductController.delete);

module.exports = router;
