const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json(),cors());

const idGen = () => {
    const id = Math.round(Math.random() * 1000);
    return id
}

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
];


morgan.token("postData", (request) => request.method === 'POST' ? JSON.stringify(request.body) : '');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));
app.use(express.static('build'));

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people </p>
        <p>${new Date()}</p>
    `);
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
})

app.post('/api/persons/', (request, response) => {
    const body = request.body;
    const sameName = persons.find((person) => person.name === body.name);

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        });
    } else if (sameName) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        name: body.name || 'NaN',
        number: body.number || 'NaN',
        id: idGen()
    }
    persons = persons.concat(person);
    response.json(person);

})

app.use((request, response) => {
    response.status(404).json({
        error: 'not found'
    })
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});