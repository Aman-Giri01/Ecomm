class ApiResponse{
    constructor(statusCode,message,data){
        this.statusCode=statusCode;
        this.message=message;
        this.data=data;
    }
    send(res){
        let resObject={
            success:true,
            message:this.message
        }
        if(this.data){
            resObject.data=this.data
        }
        res.status(this.statusCode).json(resObject)
    }
}



export default ApiResponse;
// ? new ApiResponse (201,"message",data)

// ! NOTE: every non-static method or varaibles can only be accessed by using object of that class