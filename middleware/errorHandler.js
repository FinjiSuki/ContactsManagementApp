const {CONSTANTS} = require("../constants")

const errorHandler = (err,req,res,next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    //Best practise is not to display error stack trace while error triggered in production environment
    //try a condition that error stack only appear when app is running un development environment
    switch (statusCode) {
        case CONSTANTS.VALIDATION_ERROR:
            // console.log("validationError triggered")
            req.session.errorInfo= {
                title:"Validation Error",HTTP_Status_Code: CONSTANTS.VALIDATION_ERROR,message: err.message,stackTrace:err.stack
            }
            res.redirect('/error');
            // res.json({title:"Validation Error",HTTP_Status_Code: CONSTANTS.VALIDATION_ERROR,message: err.message,stackTrace:err.stack})
            break;
        case CONSTANTS.UNAUTHORIZED:
            req.session.errorInfo= {
                title:"Unauthorized",HTTP_Status_Code: CONSTANTS.UNAUTHORIZED,message: err.message,stackTrace:err.stack
            }
            //console.log(req.session.errorInfo)
            res.redirect('/error');
            // res.json({title:"Unauthorized",HTTP_Status_Code: CONSTANTS.UNAUTHORIZED,message: err.message,stackTrace:err.stack})
            break;
        case CONSTANTS.FORBIDDEN:
            req.session.errorInfo= {
                title:"Forbidden",HTTP_Status_Code: CONSTANTS.FORBIDDEN,message: err.message,stackTrace:err.stack
            }
            res.redirect('/error');
            // res.json({title:"Forbidden",HTTP_Status_Code: CONSTANTS.FORBIDDEN,message: err.message,stackTrace:err.stack})
            break;
        case CONSTANTS.NOT_FOUND:
            req.session.errorInfo= {
                title:"Not Found",HTTP_Status_Code: CONSTANTS.NOT_FOUND,message: err.message,stackTrace:err.stack
            }
            res.redirect('/error');
            // res.json({title:"Not Found",HTTP_Status_Code: CONSTANTS.NOT_FOUND,message: err.message,stackTrace:err.stack})
            break;
        case CONSTANTS.SERVER_ERROR:
            req.session.errorInfo= {
                title:"Server Error",HTTP_Status_Code: CONSTANTS.SERVER_ERROR,message: err.message,stackTrace:err.stack
            }
            res.redirect('/error');
            // res.json({title:"Server Error",HTTP_Status_Code: CONSTANTS.SERVER_ERROR,message: err.message,stackTrace:err.stack})
            break;
        default:
            console.log("New Error triggered!")
            req.session.errorInfo= {
                title:"New Error",HTTP_Status_Code: statusCode,message: err.message,stackTrace:err.stack
            }
            res.redirect('/error');
            // res.json({title:"New Error",HTTP_Status_Code: statusCode,message: err.message,stackTrace:err.stack})
            break;
    }
}

module.exports = errorHandler;