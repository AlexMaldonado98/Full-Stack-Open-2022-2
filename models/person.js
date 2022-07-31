/*eslint no-undef: "error"*/

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const URL = process.env.MONGODB_URI;

mongoose.connect(URL)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true
    }
});

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON',{
    transform: (document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});


process.on('unCauthErro',() => {
    mongoose.connection.disconnect();
});

module.exports = mongoose.model('Person', personSchema);