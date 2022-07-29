module.exports = (error,request,response,next) => {
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'request is malformed'})
    }

    next(error)

}