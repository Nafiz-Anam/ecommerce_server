const router = require("express").Router();
const AgentController = require("../../controller/agentController");
const checkAdminToken = require("../../utilities/tokenmanager/checkAdminToken");
const agentUploader = require("../../uploads/agentUploader");

router.post("/create", checkAdminToken, agentUploader, AgentController.create);
router.post("/list", checkAdminToken, AgentController.list);
router.post("/details", checkAdminToken, AgentController.details);
router.post(
    "/update-details",
    checkAdminToken,
    agentUploader,
    AgentController.update_details
);
router.post("/update", checkAdminToken, AgentController.update);

module.exports = router;
