require("dotenv").config();
const UserModel = require("../model/userModel");
const CustomerModel = require("../model/customers");
const accessToken = require("../utilities/tokenmanager/token");
const enc_dec = require("../utilities/decryptor/decryptor");
const helpers = require("../utilities/helper/general_helper");
const otpSender = require("../utilities/sms/sentotp");
const SequenceUUID = require("sequential-uuid");

var AuthController = {
    send_otp: async (req, res) => {
        const { mobile_code, mobile_no } = req.body;
        try {
            let otp = await helpers.generateOtp(4);
            const title = "Quick Cash";
            const mobile_number = `${mobile_code}${mobile_no}`;

            const welcomeMessage =
                "Welcome to " +
                title +
                "! Your verification code is: " +
                otp +
                ". Do not share it with anyone.";

            console.log("mobile_number", mobile_number);
            console.log("welcomeMessage", welcomeMessage);

            await otpSender(mobile_number, welcomeMessage)
                .then(async (data) => {
                    console.log("sms res =>", data);
                    const uuid = new SequenceUUID({
                        valid: true,
                        dashes: true,
                        unsafeBuffer: true,
                    });

                    let token = uuid.generate();
                    let ins_data = {
                        mobile_code: mobile_code,
                        mobile_no: mobile_no,
                        otp: otp,
                        token: token,
                        sms_id: data,
                    };
                    CustomerModel.addMobileOTP(ins_data)
                        .then(async (result) => {
                            res.status(200).json({
                                status: true,
                                token: token,
                                message: "Otp sent on your mobile number",
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(500).json({
                                status: false,
                                message: error.message,
                            });
                        });
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        message: error.message,
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    otp_verify: async (req, res) => {
        try {
            let selection = "id,mobile_code,mobile_no,sms_id";
            let condition = {
                otp: req.bodyString("otp"),
                token: req.bodyString("otp_token"),
            };
            CustomerModel.selectMobileOtpDAta(selection, condition)
                .then(async (result) => {
                    if (result) {
                        let user_no = await helpers.make_sequential_no("QC");
                        console.log("user_no", user_no);

                        let password = req.bodyString("password");
                        let hashPassword = await enc_dec.encrypt(password);
                        userData = {
                            type: "user",
                            mobile_code: result.mobile_code,
                            mobile_no: result.mobile_no,
                            password: hashPassword,
                            user_no: `QC${user_no}`,
                        };
                        await UserModel.add(userData)
                            .then(async (result) => {
                                // jwt token
                                let payload = {
                                    id: result.insert_id,
                                    type: "user",
                                };
                                const token = accessToken(payload);

                                // delete OTP entry from table
                                await helpers.delete_common_entry(
                                    condition,
                                    "mobile_otp"
                                );

                                res.status(200).json({
                                    status: true,
                                    token: token,
                                    message:
                                        "OTP verified. User created successfully!",
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    status: false,
                                    message: "Internal server error!",
                                });
                            });
                    } else {
                        res.status(500).json({
                            status: false,
                            message: "Wrong OTP, Try again!",
                        });
                    }
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

    login: async (req, res) => {
        try {
            let foundUser = await UserModel.select({
                mobile_code: req.bodyString("mobile_code"),
                mobile_no: req.bodyString("mobile_no"),
            });

            if (foundUser.length > 0) {
                let user_status = await UserModel.select({
                    id: foundUser[0].id,
                    status: 0,
                });

                if (user_status.length > 0) {
                    let submittedPass = req.bodyString("password");
                    let plainPassword = enc_dec.decrypt(foundUser[0].password);
                    if (submittedPass === plainPassword) {
                        payload = {
                            id: foundUser[0].id,
                            type: foundUser[0].type,
                        };
                        const token = accessToken(payload);
                        res.status(200).json({
                            status: true,
                            token: token,
                            message: "User logged in successfully!",
                        });
                    } else {
                        res.status(500).json({
                            status: false,
                            data: {},
                            error: "Wrong Password!",
                        });
                    }
                } else {
                    res.status(500).json({
                        status: false,
                        data: {},
                        error: "User is blocked!",
                    });
                }
            } else {
                res.status(500).json({
                    status: false,
                    data: {},
                    error: "User not exists!",
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Internal server error!",
            });
        }
    },
};

module.exports = AuthController;
