const bcryptjs = require('bcryptjs');
const userService = require("../services/admin.services");

exports.CreateLibrary = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    userService.CreateLibrary({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};

exports.RegisterManager = (req, res, next) => {
    const { password } = req.body;
    const salt = bcryptjs.genSaltSync(10);

    req.body.password = bcryptjs.hashSync(req.body.password, salt);

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.RegisterManager({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};

exports.viewUsers = async (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.viewUsers({ token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json({
            Status: "Success",
            data: {
                message: result
            },
        });
    })


};

exports.viewLibraries = async (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.viewLibraries({ token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json({
            Status: "Success",
            data: {
                message: result
            },
        });
    })


};


exports.UpdateLibraryFlag = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.UpdateLibraryFlag({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};

exports.UpdateCustomerFlag = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    
    userService.UpdateCustomerFlag({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};

exports.CreateCategory = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    userService.CreateCategory({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};

exports.getQueriesManager = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.getQueriesManager({  token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};


exports.statusQueryManager = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.statusQueryManager({ req, token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    });
};