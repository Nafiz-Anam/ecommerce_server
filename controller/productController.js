require("dotenv").config();
const ProductModel = require("../model/productModel");
const enc_dec = require("../utilities/decryptor/decryptor");
const helpers = require("../utilities/helper/general_helper");
let static_url = process.env.STATIC_FILE_URL;

var ProductController = {
    create: async (req, res) => {
        try {
            let package_no = await helpers.make_sequential_no("PKG");
            console.log("package_no", package_no);

            let Product_data = {
                product_img:
                    static_url + "product/" + req.all_files?.product_img,
                package_no: `PKG${package_no}`,
                name: req.bodyString("name"),
                start_date: req.bodyString("start_date"),
                end_date: req.bodyString("end_date"),
                loan_terms: req.bodyString("loan_terms"),
                loan_interest_rate: req.bodyString("loan_interest_rate"),
                loan_amount: req.bodyString("loan_amount"),
            };

            await ProductModel.add(Product_data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Product created successfully!",
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
            let id = enc_dec.decrypt(req.bodyString("product_id"));
            let Product_data = {
                product_img: req.all_files?.product_img,
                name: req.bodyString("name"),
                start_date: req.bodyString("start_date"),
                end_date: req.bodyString("end_date"),
                loan_terms: req.bodyString("loan_terms"),
                loan_interest_rate: req.bodyString("loan_interest_rate"),
                loan_amount: req.bodyString("loan_amount"),
            };

            await ProductModel.updateDetails({ id: id }, Product_data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Product updated successfully!",
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

            const totalCount = await ProductModel.get_count(condition);
            console.log(totalCount);

            ProductModel.select_list(condition, limit)
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            package_no: val?.package_no,
                            product_img: val?.product_img
                                ? val?.product_img
                                : "",
                            name: val?.name ? val?.name : "",
                            start_date: val?.start_date ? val?.start_date : "",
                            end_date: val?.end_date ? val?.end_date : "",
                            loan_terms: val?.loan_terms ? val?.loan_terms : "",
                            loan_interest_rate: val?.loan_interest_rate
                                ? val?.loan_interest_rate
                                : "",
                            loan_amount: val?.loan_amount
                                ? val?.loan_amount
                                : "",
                            status: val?.status === 0 ? "active" : "inactive",
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response,
                        message: "Product fetched successfully!",
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
            let id = enc_dec.decrypt(req.bodyString("product_id"));
            ProductModel.select({ id: id })
                .then(async (result) => {
                    let response = [];
                    for (let val of result) {
                        let temp = {
                            id: val?.id ? enc_dec.encrypt(val?.id) : "",
                            package_no: val?.package_no,
                            product_img: val?.product_img
                                ? val?.product_img
                                : "",
                            name: val?.name ? val?.name : "",
                            start_date: val?.start_date ? val?.start_date : "",
                            end_date: val?.end_date ? val?.end_date : "",
                            loan_terms: val?.loan_terms ? val?.loan_terms : "",
                            loan_interest_rate: val?.loan_interest_rate
                                ? val?.loan_interest_rate
                                : "",
                            loan_amount: val?.loan_amount
                                ? val?.loan_amount
                                : "",
                            status: val?.status === 0 ? "active" : "inactive",
                            created_at: val?.created_at ? val?.created_at : "",
                            updated_at: val?.updated_at ? val?.updated_at : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response[0],
                        message: "Product details fetched successfully!",
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

    delete: async (req, res) => {
        try {
            let id = enc_dec.decrypt(req.bodyString("product_id"));
            ProductModel.delete({ id: id })
                .then(async (result) => {
                    res.status(200).json({
                        status: true,
                        message: "Product deleted successfully!",
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

module.exports = ProductController;
