const mongoose = require('mongoose')


const password = process.argv[2]

const url = `mongodb+srv://AlexMaldonado:${password}@myfirstapp.noumi.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('Bad request "the items needed are" : node mongo.js <password> <name> <number> or node mongo.js <password>');
    process.exit(1)
} else if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Phonebook');
        result.forEach(person => {
            console.log(person.name+' '+person.number)
        })
        mongoose.connection.close();
        process.exit(1);
    })

} else if (process.argv.length === 5) {

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close();
        process.exit(1)
    })
}


/* 
Note.find({important: false}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
}) */