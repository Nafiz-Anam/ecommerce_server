require("dotenv").config();
const env = process.env.ENVIRONMENT;
const config = require("../config/config.json")[env];
const pool = require("../config/database");
const dbtable = config.table_prefix + "products";
const helpers = require("../utilities/helper/general_helper");

var dbModel = {
    add: async (data) => {
        console.log("data => ", data);
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(dbtable, data);
        qb.release();
        return response;
    },

    // select_limit: async (condition, limit) => {
    //     let qb = await pool.get_connection();
    //     let response = await qb
    //         .select("*")
    //         .where(condition)
    //         .order_by("designation", "asc")
    //         .limit(limit.perpage, limit.start)
    //         .get(dbtable);
    //     qb.release();
    //     return response;
    // },

    select: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.select("*").where(condition).get(dbtable);
        qb.release();
        return response;
    },

    select_list: async (condition, limit) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select("*")
            .where(condition)
            .order_by("id", "desc")
            .limit(limit.perpage)
            .offset(limit.start)
            .get(dbtable);
        console.log("query => ", qb.last_query());
        qb.release();
        return response;
    },

    get_count: async (condition) => {
        let qb = await pool.get_connection();
        let final_cond = " where ";
        if (Object.keys(condition).length) {
            let condition_str = await helpers.get_and_conditional_string(
                condition
            );
            if (final_cond == " where ") {
                final_cond = final_cond + condition_str;
            } else {
                final_cond = final_cond + " and " + condition_str;
            }
        }
        if (final_cond == " where ") {
            final_cond = "";
        }
        let query = "select count(*) as total from " + dbtable + final_cond;
        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response[0]?.total;
    },

    // selectSpecific: async (selection, condition) => {
    //     let qb = await pool.get_connection();
    //     let response = await qb.select(selection).where(condition).get(dbtable);
    //     qb.release();
    //     return response;
    // },
    // selectOne: async (selection, condition) => {
    //     let qb = await pool.get_connection();
    //     let response = await qb.select(selection).where(condition).get(dbtable);
    //     qb.release();
    //     return response[0];
    // },
    // selectUserDetails: async (condition) => {
    //     let qb = await pool.get_connection();
    //     let response = await qb.select(selection).where(condition).get(dbtable);
    //     qb.release();
    //     return response[0];
    // },
    updateDetails: async (condition, data) => {
        let qb = await pool.get_connection();
        let response = await qb.set(data).where(condition).update(dbtable);
        qb.release();
        console.log(qb.last_query());
        return response;
    },
    delete: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.where(condition).delete(dbtable);
        qb.release();
        console.log(qb.last_query());
        return response;
    },
};

module.exports = dbModel;
