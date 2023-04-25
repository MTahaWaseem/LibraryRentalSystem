function errorHandler(err, req, res, next) {
    if (typeof err === 'string') {
        return res.status(400). json({ data: err});
    }

    if (typeof err === 'ValidationError') {
        return res.status(400). json({ 
            status: "Fail",
            data: err.message });
    }

    if (typeof err === 'UnauthorizedError') {
        return res.status(401). json({ 
            status: "Fail",
            data: err.message });
    }
    
    return res.status(500). json({ 
        status: "Fail",
        data: err });
}

module.exports ={
    errorHandler,
};