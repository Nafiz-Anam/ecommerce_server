require("dotenv").config();
const UserModel = require("../model/userModel");
const LoanModel = require("../model/loanModel");
const enc_dec = require("../utilities/decryptor/decryptor");
const helpers = require("../utilities/helper/general_helper");
const moment = require("moment");

var LoanController = {
    apply: async (req, res) => {
        let user_id = req.user.id;
        try {
            let order_no = await helpers.make_sequential_no("ODR");
            console.log("order_no", order_no);
            let loan_apply_data = {
                user_id: user_id,
                product_id: enc_dec.decrypt(req.bodyString("product_id")),
                order_no: `ODR${order_no}`,
            };
            await LoanModel.add(loan_apply_data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Loan applied successfully!",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        message: "Unable to apply loan. Try again!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Server side error! Try again.",
            });
        }
    },

    update: async (req, res) => {
        let loan_id = enc_dec.decrypt(req.bodyString("loan_id"));
        try {
            let loan_data = {
                closing_date: req.bodyString("closing_date"),
                payment_status: req.bodyString("payment_status"),
                loan_status: req.bodyString("loan_status"),
                updated_at: moment().format("YYYY-MM-DD HH:mm"),
            };
            await LoanModel.updateDetails({ id: loan_id }, loan_data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Loan updated successfully!",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        message: "Unable to apply loan. Try again!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Server side error! Try again.",
            });
        }
    },

    // SELECT * FROM qc_loans JOIN qc_users ON qc_loans.user_id = qc_users.id JOIN qc_products ON qc_loans.product_id = qc_products.id WHERE qc_loans.id = 2;

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

            let date_condition = {};
            let and_condition = {};

            if (req.bodyString("loan_status")) {
                and_condition.loan_status = req.bodyString("loan_status");
            }
            if (req.bodyString("payment_status")) {
                and_condition.payment_status = req.bodyString("payment_status");
            }
            if (req.bodyString("request_status")) {
                and_condition.request_status = req.bodyString("request_status");
            }

            if (req.bodyString("from_date") && req.bodyString("to_date")) {
                date_condition.from_date = req.bodyString("from_date");
                date_condition.to_date = req.bodyString("to_date");
            }

            LoanModel.select_list(and_condition, date_condition, limit)
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let loan_details = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            order_no: val?.order_no,
                            user_id: val?.user_id
                                ? enc_dec.encrypt(val?.user_id)
                                : "",
                            product_id: val?.product_id
                                ? enc_dec.encrypt(val?.product_id)
                                : "",
                            loan_status: val?.loan_status,
                            payment_status: val?.payment_status,
                            request_status: val?.request_status,
                            closing_date: val?.closing_date
                                ? val?.closing_date
                                : "",
                            due_amount: val?.due_amount ? val?.due_amount : "",
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
                        };

                        let user_data = await helpers.get_data_list(
                            "*",
                            "users",
                            { id: val.user_id }
                        );
                        let user_details = await helpers.get_data_list(
                            "*",
                            "user_details",
                            { user_id: val.user_id }
                        );
                        let product_details = await helpers.get_data_list(
                            "*",
                            "products",
                            { id: val.product_id }
                        );

                        let user_info = {
                            user_no: user_data[0].user_no,
                            type: user_data[0]?.type ? user_data[0]?.type : "",
                            mobile_code: user_data[0]?.mobile_code
                                ? user_data[0]?.mobile_code
                                : "",
                            mobile_no: user_data[0]?.mobile_no
                                ? user_data[0]?.mobile_no
                                : "",
                            status: user_data[0]?.status,
                            user_created_at: user_data[0]?.created_at
                                ? user_data[0]?.created_at
                                : "",
                            select_id_type: user_details[0]?.select_id_type
                                ? user_details[0]?.select_id_type
                                : "",
                            id_front_side: user_details[0]?.id_front_side
                                ? user_details[0]?.id_front_side
                                : "",
                            id_back_side: user_details[0]?.id_back_side
                                ? user_details[0]?.id_back_side
                                : "",
                            user_image: user_details[0]?.user_image
                                ? user_details[0]?.user_image
                                : "",
                            full_name: user_details[0]?.full_name
                                ? user_details[0]?.full_name
                                : "",
                            card_no: user_details[0]?.card_no
                                ? user_details[0]?.card_no
                                : "",
                            birth_date: user_details[0]?.birth_date
                                ? user_details[0]?.birth_date
                                : "",
                            gender: user_details[0]?.gender
                                ? user_details[0]?.gender
                                : "",
                            blood_group: user_details[0]?.blood_group
                                ? user_details[0]?.blood_group
                                : "",
                            occupation: user_details[0]?.occupation
                                ? user_details[0]?.occupation
                                : "",
                            education: user_details[0]?.education
                                ? user_details[0]?.education
                                : "",
                            salary_range: user_details[0]?.salary_range
                                ? user_details[0]?.salary_range
                                : "",
                            residence_type: user_details[0]?.residence_type
                                ? user_details[0]?.residence_type
                                : "",
                            first_person_name: user_details[0]
                                ?.first_person_name
                                ? user_details[0]?.first_person_name
                                : "",
                            first_phone: user_details[0]?.first_phone
                                ? user_details[0]?.first_phone
                                : "",
                            first_relation: user_details[0]?.first_relation
                                ? user_details[0]?.first_relation
                                : "",
                            second_person_name: user_details[0]
                                ?.second_person_name
                                ? user_details[0]?.second_person_name
                                : "",
                            second_phone: user_details[0]?.second_phone
                                ? user_details[0]?.second_phone
                                : "",
                            second_relation: user_details[0]?.second_relation
                                ? user_details[0]?.second_relation
                                : "",
                            third_person_name: user_details[0]
                                ?.third_person_name
                                ? user_details[0]?.third_person_name
                                : "",
                            third_phone: user_details[0]?.third_phone
                                ? user_details[0]?.third_phone
                                : "",
                            third_relation: user_details[0]?.third_relation
                                ? user_details[0]?.third_relation
                                : "",
                            account_holder_name: user_details[0]
                                ?.account_holder_name
                                ? user_details[0]?.account_holder_name
                                : "",
                            account_number: user_details[0]?.account_number
                                ? user_details[0]?.account_number
                                : "",
                            ifsp_code: user_details[0]?.ifsp_code
                                ? user_details[0]?.ifsp_code
                                : "",
                            is_loan_applied: user_details[0]?.is_loan_applied,
                        };

                        loan_details.user_details = user_info;
                        loan_details.product_details = {
                            product_img: product_details[0]?.product_img
                                ? product_details[0]?.product_img
                                : "",
                            name: product_details[0]?.name
                                ? product_details[0]?.name
                                : "",
                            start_date: product_details[0]?.start_date
                                ? product_details[0]?.start_date
                                : "",
                            end_date: product_details[0]?.end_date
                                ? product_details[0]?.end_date
                                : "",
                            loan_terms: product_details[0]?.loan_terms
                                ? product_details[0]?.loan_terms
                                : "",
                            loan_interest_rate: product_details[0]
                                ?.loan_interest_rate
                                ? product_details[0]?.loan_interest_rate
                                : 0,
                            loan_amount: product_details[0]?.loan_amount
                                ? product_details[0]?.loan_amount
                                : 0,
                            status: product_details[0]?.status,
                            created_at: product_details[0]?.created_at
                                ? product_details[0]?.created_at
                                : "",
                            updated_at: product_details[0]?.updated_at
                                ? product_details[0]?.updated_at
                                : "",
                        };

                        let temp = {
                            loan_details,
                        };

                        response.push(temp);
                    }

                    res.status(200).json({
                        status: true,
                        data: response,
                        message: "Loan list fetched successfully!",
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

module.exports = LoanController;

// let response = [];
// for (val of result) {
//     temp = {
//         loan_id: val?.loan_id ? enc_dec.encrypt(val?.loan_id) : "",
//         loan_created: val?.loan_created ? val?.loan_created : "",
//         loan_updated: val?.loan_updated ? val?.loan_updated : "",
//         loan_status: val?.loan_status ? val?.loan_status : "",
//         payment_status: val?.payment_status ? val?.payment_status : "",
//         user_id: val?.id ? enc_dec.encrypt(val?.id) : "",
//         mobile_code: val?.mobile_code ? val?.mobile_code : "",
//         mobile_no: val?.mobile_no ? val?.mobile_no : "",
//         product_img: val?.product_img ? val?.product_img : "",
//         product_name: val?.name ? val?.name : "",
//         product_start_date: val?.start_date ? val?.start_date : "",
//         product_end_date: val?.end_date ? val?.end_date : "",
//         loan_terms: val?.loan_terms ? val?.loan_terms : "",
//         loan_interest_rate: val?.loan_interest_rate
//             ? val?.loan_interest_rate
//             : "",
//         loan_amount: val?.loan_amount ? val?.loan_amount : "",
//         select_id_type: val?.select_id_type ? val?.select_id_type : "",
//         id_front_side: val?.id_front_side ? val?.id_front_side : "",
//         id_back_side: val?.id_back_side ? val?.id_back_side : "",
//         user_image: val?.user_image ? val?.user_image : "",
//         full_name: val?.full_name ? val?.full_name : "",
//         card_no: val?.card_no ? val?.card_no : "",
//         birth_date: val?.birth_date ? val?.birth_date : "",
//         gender: val?.gender ? val?.gender : "",
//         blood_group: val?.blood_group ? val?.blood_group : "",
//         occupation: val?.occupation ? val?.occupation : "",
//         education: val?.education ? val?.education : "",
//         salary_range: val?.salary_range ? val?.salary_range : "",
//         residence_type: val?.residence_type ? val?.residence_type : "",
//         first_person_name: val?.first_person_name ? val?.first_person_name : "",
//         first_phone: val?.first_phone ? val?.first_phone : "",
//         first_relation: val?.first_relation ? val?.first_relation : "",
//         second_person_name: val?.second_person_name
//             ? val?.second_person_name
//             : "",
//         second_phone: val?.second_phone ? val?.second_phone : "",
//         second_relation: val?.second_relation ? val?.second_relation : "",
//         third_person_name: val?.third_person_name ? val?.third_person_name : "",
//         third_phone: val?.third_phone ? val?.third_phone : "",
//         third_relation: val?.third_relation ? val?.third_relation : "",
//         account_holder_name: val?.account_holder_name
//             ? val?.account_holder_name
//             : "",
//         account_number: val?.account_number ? val?.account_number : "",
//         ifsp_code: val?.ifsp_code ? val?.ifsp_code : "",
//     };
//     response.push(temp);
// }
