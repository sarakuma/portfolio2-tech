var express = require('express');
var redis = require('redis');
var ejs = require('ejs');
var path = require('path');


const PORT = process.env.PORT || 8080;
//const HOST = '127.0.0.1';

var app = express();
var db = redis.createClient();

db.on('error', (err) => {
    console.log(`Error related to Redis db: ${err}`);
})

app.set('view engine', 'ejs');

/*app.use(express.static(path.join(__dirname,'/../')));*/
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    

    db.incr('visitCount', function(err, value) {
        if (err) {
           console.log(`Error related to Redis increment method: ${err}`);
        }  
       else {
           passCounter(value) ;
        };
   });
    
    function passCounter (value) {
        
        let vCount = value;
        console.log(vCount);
        res.render('index', {count: vCount});
    };
});;

app.listen(HOST, () => {
    console.log(`Express server started on port ${PORT}`, PORT);
});
           
module.exports = app;