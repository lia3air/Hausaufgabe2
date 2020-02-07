const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');

const app = express();

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

let messages = [];

if (fs.existsSync('./messages.json')){
    const text = fs.readFileSync('./messages.json',{encoding:'UTF8'})
    messages = JSON.parse(text);
}else{
    messages = [];
}

app.get('/', (request, response) => {
    response.render('home', {messages: messages});
});

app.post('/new', (request, response) => {

    if (fs.existsSync('./messages.json')){
        const text = fs.readFileSync('./messages.json',{encoding:'UTF8'});
        messages = JSON.parse(text);
    }else{
        messages = [];
    }

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    messages.push({
        author: request.body.author,
        text: request.body.text,
        date: date + "," + time
    });

    const text = JSON.stringify(messages);
    fs.writeFileSync('./messages.json',text,{encoding: 'UTF8'});

    response.redirect('/');

});

app.post('/delete', (request,response) => {

    const text = fs.readFileSync('./messages.json',{encoding:'UTF8'});
    messages = JSON.parse(text);

    for (let i=0 ; i<messages.length; i++){

        if (messages[i].date===request.body.date){

            messages.splice(i, 1);

        }

    }

    const text1 = JSON.stringify(messages);
    fs.writeFileSync('./messages.json',text1,{encoding: 'UTF8'});

    response.redirect('/');

});
