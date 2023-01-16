function createServer(){
    const PORT = 3000;
    const express = require('express');
    const path = require('path');
    const app = express();
    const createPath = (page) => path.resolve(__dirname,'public', `${page}.html`)
    app.listen( PORT,(error)=>{
        error ? console.log(error) : console.log( `server listening port ${PORT}` );
    });
    app.get('/',(req, res)=>{
        res.sendFile(createPath('index.html'));
    });
    
    app.use((req, res) =>{
        res
            .status(404)
            .sendFile(createPath('error.html'));
    });
}
createServer();