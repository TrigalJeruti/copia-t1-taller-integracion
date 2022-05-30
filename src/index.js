const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
/* const config_ = require('./config/database'); */
require('dotenv').config();


app.set('port', process.env.PORT || 3000);


/* (async () => {
    try{
        await config_.authenticate()
        console.log("Conectados a la base de datos");
    }catch (error){
        throw new Error(error);
    }

})(); */





//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());



//routes
app.use(require('./routes/index'));
/* app.use('/users', require('./routes/user')); */

    



//starting the server
app.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`);
});