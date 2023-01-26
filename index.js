function createServer(){
    const PORT = 3000;
    const express = require('express');
    const path = require('path');
    const app = express();
    const createPath = (page) => path.resolve(__dirname,'public', `${page}.html`)
    app.listen( PORT,(error)=>{
        error ? console.log(error) : console.log( `server listening port ${PORT}` );
    });
    app.use(express.static('public'));



    app.get('/',(req, res)=>{
        res.sendFile(createPath('auth_index'));
    });


}
createServer();