const errorMiddleware = (err, req, res, next) => {

   
    let customError = { 
        statusCode: err.statusCode || 500, 
        message: err.message || 'Server Error' 
    };

    console.error(err);

    if (err.name === "CastError") {
        customError = {
            statusCode: 404,
            message: "Resource not found"
        };
    }


    if (err.code === 11000) {
        customError = {
            statusCode: 400,
            message: `Duplicate field value entered: ${JSON.stringify(err.keyValue)}`
        };
    }


    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(val => val.message);
        customError = {
            statusCode: 400,
            message: messages.join(', ')
        };
    }


    if (process.env.NODE_ENV === 'development') {
        customError.stack = err.stack;
    }

    res.status(customError.statusCode).json({
        success: false,
        error: customError.message,
        ...(customError.stack && { stack: customError.stack })
    });
};


export default errorMiddleware;
