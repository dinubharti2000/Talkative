const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/User', {useNewUrlParser: true, useUnifiedTopology: true});

const users = mongoose.model('Users', { name: String });
const Data = new users({ name: 'mehboob' });
console.log(Data)
user_name = (Data['name'])
if(user_name = 'mehboob'){
    console.log("mehboob hai bc")
}
else{
    Data.save()
}
