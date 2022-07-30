module.exports = (error,request,response,next) => {
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'request is malformed'})
    }else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)
}