const router = require("express").Router();
const checkUserToken = require("../../utilities/tokenmanager/checkUserToken");
const ReviewController = require("../../controller/reviewController");

router.post("/add", checkUserToken, ReviewController.add_review);
router.post("/list", checkUserToken, ReviewController.list_reviews);

module.exports = router;
