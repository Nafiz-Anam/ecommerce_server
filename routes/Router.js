const router = require("express").Router();
const UserRouter = require("./UserRoute/UserRouter");
const ReviewRouter = require("./ReviewRoute/ReviewRoute");
const AdminRouter = require("./AdminRoute/AdminRoute");
const AgentRouter = require("./AgentRoute/AgentRoute");
const ProductRouter = require("./ProductRoute/ProductRoute");
const LoanRouter = require("./LoanRoute/LoanRoute");


router.use("/user", UserRouter);
router.use("/admin", AdminRouter);
router.use("/agent", AgentRouter);
router.use("/product", ProductRouter);
router.use("/review", ReviewRouter);
router.use("/loan", LoanRouter);

module.exports = router;
