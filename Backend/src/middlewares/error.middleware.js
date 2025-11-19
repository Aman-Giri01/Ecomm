export const errorMiddleware=(err,req,res,next)=>{
    let statusCode=err.statusCode || 500;
    let message=err.message || "Something Went wrong"
    if(err.name==="ValidationError"){

        statusCode=400;
        message=`${Object.values(err.errors).map((ele)=>ele.message)}`
    }

    if(err.code===11000){
        statusCode=409;
         message=`${Object.keys(err.keyValue)[0]} already exists`
    }
    if(err.name==="CastError"){
        statusCode=400;
        message="Invalid MongoDb ID"
    }
    if(err.name==="JsonWebTokenError"){
        statusCode=401;
        message="Invalid session please login again"
    }
    // res.status(statusCode).json({success:false,message:message,errObj:err,errLine:err.stack});
    res.status(statusCode).json({success:false,message:message});
}