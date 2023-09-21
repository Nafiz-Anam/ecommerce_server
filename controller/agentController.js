require("dotenv").config();
const AgentModel = require("../model/agentModel");
const enc_dec = require("../utilities/decryptor/decryptor");
const helpers = require("../utilities/helper/general_helper");
let static_url = process.env.STATIC_FILE_URL;

var AdminController = {
    create: async (req, res) => {
        try {
            let agent_no = await helpers.make_sequential_no("AGT");
            console.log("agent_no", agent_no);

            let agent_data = {
                agent_no: `AGT${agent_no}`,
                profile_img: static_url + "agent/" + req.all_files?.profile_img,
                id_card_front:
                    static_url + "agent/" + req.all_files?.id_card_front,
                id_card_back:
                    static_url + "agent/" + req.all_files?.id_card_back,
                name: req.bodyString("name"),
                email: req.bodyString("email"),
                mobile_code: req.bodyString("mobile_code"),
                mobile_no: req.bodyString("mobile_no"),
                country: req.bodyString("country"),
                age: req.bodyString("age"),
                gender: req.bodyString("gender"),
                present_address: req.bodyString("present_address"),
                permanent_address: req.bodyString("permanent_address"),
                bank_name: req.bodyString("bank_name"),
                branch_name: req.bodyString("branch_name"),
                account_no: req.bodyString("account_no"),
                account_holder_name: req.bodyString("account_holder_name"),
                mobile_bank_name: req.bodyString("mobile_bank_name"),
                mobile_bank_code: req.bodyString("mobile_bank_code"),
                mobile_bank_no: req.bodyString("mobile_bank_no"),
                role: req.bodyString("role"),
                salary: req.bodyString("salary"),
            };

            await AgentModel.add(agent_data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Agent created successfully!",
                    });
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        message: "Internal server error!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Internal server error!",
            });
        }
    },

    update_details: async (req, res) => {
        try {
            let id = enc_dec.decrypt(req.bodyString("agent_id"));
            let agent_data = {
                profile_img: req.all_files?.profile_img,
                id_card_front: req.all_files?.id_card_front,
                id_card_back: req.all_files?.id_card_back,
                name: req.bodyString("name"),
                email: req.bodyString("email"),
                mobile_code: req.bodyString("mobile_code"),
                mobile_no: req.bodyString("mobile_no"),
                country: req.bodyString("country"),
                age: req.bodyString("age"),
                gender: req.bodyString("gender"),
                present_address: req.bodyString("present_address"),
                permanent_address: req.bodyString("permanent_address"),
                bank_name: req.bodyString("bank_name"),
                branch_name: req.bodyString("branch_name"),
                account_no: req.bodyString("account_no"),
                account_holder_name: req.bodyString("account_holder_name"),
                mobile_bank_name: req.bodyString("mobile_bank_name"),
                mobile_bank_no: req.bodyString("mobile_bank_no"),
                role: req.bodyString("role"),
                salary: req.bodyString("salary"),
            };

            await AgentModel.updateDetails({ id: id }, agent_data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Details updated successfully!",
                    });
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        message: "Internal server error!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Internal server error!",
            });
        }
    },

    update: async (req, res) => {
        try {
            let id = enc_dec.decrypt(req.bodyString("agent_id"));
            let agent_data = {
                mobile_code: req.bodyString("mobile_code"),
                mobile_no: req.bodyString("mobile_no"),
                salary: req.bodyString("salary"),
                incentive: req.bodyString("incentive"),
                status: req.bodyString("status"),
            };

            await AgentModel.updateDetails({ id: id }, agent_data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Details updated successfully!",
                    });
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        message: "Internal server error!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Internal server error!",
            });
        }
    },

    list: async (req, res) => {
        try {
            let limit = {
                perpage: 10,
                start: 0,
            };
            if (req.bodyString("perpage") && req.bodyString("page")) {
                perpage = parseInt(req.bodyString("perpage"));
                start = parseInt(req.bodyString("page"));
                limit.perpage = perpage;
                limit.start = (start - 1) * perpage;
            }
            let condition = {
                status: 0,
            };
            const totalCount = await AgentModel.get_count(condition);
            AgentModel.select_list(condition, limit)
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            agent_no: val?.agent_no,
                            profile_img: val?.profile_img
                                ? val?.profile_img
                                : "",
                            id_card_front: val?.id_card_front
                                ? val?.id_card_front
                                : "",
                            id_card_back: val?.id_card_back
                                ? val?.id_card_back
                                : "",
                            name: val?.name ? val?.name : "",
                            email: val?.email ? val?.email : "",
                            mobile_code: val?.mobile_code
                                ? val?.mobile_code
                                : "",
                            mobile_no: val?.mobile_no ? val?.mobile_no : "",
                            country: val?.country ? val?.country : "",
                            age: val?.age ? val?.age : "",
                            gender: val?.gender ? val?.gender : "",
                            present_address: val?.present_address
                                ? val?.present_address
                                : "",
                            permanent_address: val?.permanent_address
                                ? val?.permanent_address
                                : "",
                            bank_name: val?.bank_name ? val?.bank_name : "",
                            branch_name: val?.branch_name
                                ? val?.branch_name
                                : "",
                            account_no: val?.account_no ? val?.account_no : "",
                            account_holder_name: val?.account_holder_name
                                ? val?.account_holder_name
                                : "",
                            mobile_bank_name: val?.mobile_bank_name
                                ? val?.mobile_bank_name
                                : "",
                            mobile_bank_code: val?.mobile_bank_code
                                ? val?.mobile_bank_code
                                : "",
                            mobile_bank_no: val?.mobile_bank_no
                                ? val?.mobile_bank_no
                                : "",
                            role: val?.role ? val?.role : "",
                            salary: val?.salary ? val?.salary : "",
                            incentive: val?.incentive,
                            status: val?.status === 0 ? "active" : "inactive",
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response,
                        message: "Agents fetched successfully!",
                        total: totalCount,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        data: {},
                        error: "Server side error!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                data: {},
                error: "Server side error!",
            });
        }
    },

    details: async (req, res) => {
        try {
            let id = enc_dec.decrypt(req.bodyString("agent_id"));
            AgentModel.select({ id: id })
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            profile_img: val?.profile_img
                                ? val?.profile_img
                                : "",
                            id_card_front: val?.id_card_front
                                ? val?.id_card_front
                                : "",
                            id_card_back: val?.id_card_back
                                ? val?.id_card_back
                                : "",
                            name: val?.name ? val?.name : "",
                            email: val?.email ? val?.email : "",
                            mobile_code: val?.mobile_code
                                ? val?.mobile_code
                                : "",
                            mobile_no: val?.mobile_no ? val?.mobile_no : "",
                            country: val?.country ? val?.country : "",
                            age: val?.age ? val?.age : "",
                            gender: val?.gender ? val?.gender : "",
                            present_address: val?.present_address
                                ? val?.present_address
                                : "",
                            permanent_address: val?.permanent_address
                                ? val?.permanent_address
                                : "",
                            bank_name: val?.bank_name ? val?.bank_name : "",
                            branch_name: val?.branch_name
                                ? val?.branch_name
                                : "",
                            account_no: val?.account_no ? val?.account_no : "",
                            account_holder_name: val?.account_holder_name
                                ? val?.account_holder_name
                                : "",
                            mobile_bank_name: val?.mobile_bank_name
                                ? val?.mobile_bank_name
                                : "",
                            mobile_bank_code: val?.mobile_bank_code
                                ? val?.mobile_bank_code
                                : "",
                            mobile_bank_no: val?.mobile_bank_no
                                ? val?.mobile_bank_no
                                : "",
                            role: val?.role ? val?.role : "",
                            salary: val?.salary ? val?.salary : "",
                            status: val?.status === 0 ? "active" : "inactive",
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response[0],
                        message: "Agent details fetched successfully!",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        data: {},
                        error: "Server side error!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                data: {},
                error: "Server side error!",
            });
        }
    },
};

module.exports = AdminController;
