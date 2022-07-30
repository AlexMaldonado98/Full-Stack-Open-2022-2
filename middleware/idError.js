module.exports = (error,request,response,next) => {
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'request is malformed'})
    }else if(error.name === 'ValidationError'){
        console.log(error);
        return response.status(400).json({error: error.message})
    }
    next(error)
}