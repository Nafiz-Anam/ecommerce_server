const router = require("express").Router();
const AgentController = require("../../controller/agentController");
const LoanController = require("../../controller/loanController");
const checkAdminToken = require("../../utilities/tokenmanager/checkAdminToken");
const agentUploader = require("../../uploads/agentUploader");
const checkUserToken = require("../../utilities/tokenmanager/checkUserToken");

router.post("/apply", checkUserToken, LoanController.apply);
router.post("/update", checkAdminToken, LoanController.update);
router.post("/list", checkAdminToken, LoanController.list);
// router.post("/list", checkAdminToken, AgentController.list);
// router.post("/details", checkAdminToken, AgentController.details);
// router.post(
//     "/update-details",
//     checkAdminToken,
//     agentUploader,
//     AgentController.update_details
// );
// router.post("/update", checkAdminToken, AgentController.update);

module.exports = router;
