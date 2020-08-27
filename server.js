const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'))

const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  
}); 
async function init() {
    try{
        await sequelize.sync({ force: false })
         app.listen(PORT, () => console.log('Now listening'))
    }
    catch(err){
        console.log(err)
    }
}

init()
