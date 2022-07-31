module.exports = (request, response) => {
    response.status(404).json({
        error: 'Page not found'
    });
};