const mongoose = require('mongoose');

const authorShema = new mongoose.Schema({
name:{
    type:String,
    required: true
}
});

module.exports = mongoose.model('Author', authorShema);

