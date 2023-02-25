// Import mongoose
const mongoose = require('mongoose');
// Import mongoose unique validator
const uniqueValidator = require('mongoose-unique-validator');

// Schema user
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// Unique validator application
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);