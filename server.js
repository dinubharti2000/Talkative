const express = require('express')
const app = express()
port = 3000

app.use(express.static(__dirname));
app.use(express.static("public"));


app.get('/',(req,res)=>{
    res.sendFile('./public/Home.html',{root:__dirname})
});

app.listen(port,()=>{
    console.log(`server is listening at http://localhost:${port}`)
});