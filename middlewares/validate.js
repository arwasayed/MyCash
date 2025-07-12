exports.validate=(schema)=>{
    return (req,res,next)=>{
        let x = schema.validate(req.body,{abortEarly:false});
            if(x.error){
                return res.status(200).json ({
                    status:"fail",
                    message:x.error.details
                })
            }else{
                next()
            }
    }
}