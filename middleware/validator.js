const { check, body } = require("express-validator/check");
const User = require("../models/users");
exports.validator = [
    check("email")
        .optional({ checkFalsy: true })
        .isEmail()
        .withMessage("Please Enter a valid Email")
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject(
                        "E-mail already exists, try something else."
                    );
                }
            });
        }),
    check("number")
        .isMobilePhone("en-IN")
        .withMessage("Please Enter a valid Number")
        .custom((value, { req }) => {
            return User.findOne({ number: value }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject(
                        "Number already exists, try something else."
                    );
                }
            });
        }),
    check("name")
        .withMessage("Enter a valid name")
        .custom((value, { req }) => {
            return User.findOne({ name: value }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject(
                        "Username already exists, try something else."
                    );
                }
            });
        }),
];

exports.editValidator = [
    check("email")
        .optional({ checkFalsy: true })
        .isEmail()
        .withMessage("Please Enter a valid Email")
        .custom((value, { req }) => {
            return User.findOne({ email: value,_id:{$ne:req.session.user._id} }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject(
                        "E-mail already exists, try something else."
                    );
                }
            });
        }),
    // check("number")
    //     .isMobilePhone("en-IN")
    //     .withMessage("Please Enter a valid Number")
    //     .custom((value, { req }) => {
    //         return User.findOne({
    //             number: value,
    //             _id: { $ne: req.session.user._id },
    //         }).then((userDoc) => {
    //             if (userDoc) {
    //                 return Promise.reject(
    //                     "Number already exists, try something else."
    //                 );
    //             }
    //         });
    //     }),
    check("name")
        .withMessage("Enter a valid name")
        .custom((value, { req }) => {
            return User.findOne({
                name: value,
                _id: { $ne: req.session.user._id },
            }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject(
                        "Username already exists, try something else."
                    );
                }
            });
        }),
];
