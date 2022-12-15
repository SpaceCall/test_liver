function createServer(){
    const fs = require( 'fs' );
    const http = require( 'http' );
    const server = http.createServer( onConnectionHttp );
    const port = 1085;
    const io = require('socket.io');
    const ioServer = io( server );

    ioServer.on('connection', onConnectSocket );
    function onConnectionHttp( req, res ){
        console.log( 'connection' );
        if( req.url === '/' ){
            fs.readFile('public/auth_index.html',(err,data)=>{
                if( err ) console.log( err );
                res.end( data );
            });
        }
        else if( req.url === '/auth_index.js' ){
            fs.readFile('public/auth_index.js',(err,data)=>{
                if( err ) console.log( err );
                res.end( data );
            });
        }
        else if( req.url === '/auth_style.css' ){
            fs.readFile('public/auth_style.css',(err,data)=>{
                if( err ) console.log( err );
                res.end( data );
            });
        }
    }
    // Обработка socket.io запросов
    function onConnectSocket( socket ){
        console.log('ioServer : new socket connected');
        /*
            схема обработки сообщений пользователя
            socket - подключенный пользователь
            socket.on('название канала связи',( полученные данные )=>{
                // что-то делаем
            });
            // отправка юзеру данных
            socket.emit( 'название канала связи', параметры );

            // отправка данных всем юзерам, кроме текущего
            socket.broadcast.emit( 'название канала связи', параметры );

            // отправка данных всем юзерам
            ioServer.emit( 'название канала связи', параметры );
        */
        /*---- тут установка прослушивания на действия ( обработка собщений сервером -------*/
        socket.on('auth_data',(data)=>{
            console.log(data);
        });
        // если вышел
        socket.on('disconnect', ()=>{
            console.log( 'socket disconnected' );
        });
    }
    server.listen( port,()=>{
        console.log( 'server online' );
    });
}
createServer();