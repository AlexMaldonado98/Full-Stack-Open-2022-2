require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();
const idError = require('./middleware/idError');
const notFound = require('./middleware/notFound');
let persons = [];

morgan.token("postData", (request) => request.method === 'POST' ? JSON.stringify(request.body) : '');

app.use(express.static('build'));
app.use(express.json(), cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people </p>
        <p>${new Date()}</p>
    `);
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then((result) => {
        response.json(result);
    });
});

app.get('/api/persons/:id', (request, response,next) => {
    const {id} = request.params;
    Person.findById(id).then(result => {
        if(result){
            response.json(result)
        }else{
            response.status(404).end();
        }
    }).catch(error => {
        next(error)
    });
});

app.delete('/api/persons/:id', (request, response,next) => {
    const {id} = request.params
    Person.findByIdAndDelete(id).then(result => {
        if(result){
            response.status(204).end();
        }else{
            response.status(404).end();
        }
    }).catch(error => {
        next(error)
    })
})

app.post('/api/persons/', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        });
    }

    const person = new Person({
        name: body.name || 'NaN',
        number: body.number || 'NaN'
    })

    person.save().then(result => {
        response.json(result);
    });

})

app.use(notFound);

app.use(idError);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});