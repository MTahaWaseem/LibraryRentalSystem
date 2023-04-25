const bcryptjs = require('bcryptjs');
const userService = require("../services/general.services");


exports.register = (req, res, next) => {


    userService.register(req.body, (error, result) => {
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

exports.logout = async (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.logout({ token }, (error, result) => {
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

exports.login = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            
            // error: true,
            // message: "user required"
            Status: "Fail",
            data: {
                message: "Email and password required!"
            },
        });
      }

    userService.login({ email, password }, (error, result) => {
        if (error) {
            return next(error);
        }
        res.cookie('jwt', result.token, result.cookieOptions);
        return res.status(200).send({
            Status: "Success",
            data: {
                message: result
            },
        });
    })

};

exports.userProfile = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    userService.userProfile({ token }, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json({
            Status: "Success",
            data: {
                result
            },
        });
    })
};

exports.updateProfile = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.updateProfile({ req, token }, (error, result) => {
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

exports.updatePassword = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    userService.updatePassword({ req, token }, (error, result) => {
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


exports.getCategory = (req, res, next) => {

  

    userService.getCategory({ req }, (error, message) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json({
            Status: "Success",
            data: {
                message
            },
        });
    })
};

exports.getLibraries = (req, res, next) => {
    

    userService.getLibraries({ req }, (error, result) => {
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