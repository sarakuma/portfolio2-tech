var express = require('express');
var redis = require('redis');
var ejs = require('ejs');
var path = require('path');
var nconf = require('nconf');


const PORT = process.env.PORT || 8080;
//const HOST = '127.0.0.1';

nconf.argv().env().file('keys.json');

var app = express();
var db = redis.createClient(
    
    nconf.get('redisPort') || '6379',
    nconf.get('redisHost') || '127.0.0.1',
    {
    'auth_pass': nconf.get('redisKey'),
    'return_buffers': true
  }
).on('error', (err) => console.error('ERR:REDIS:',  nconf.get('redisHost') + err));


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

app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}`);
});
           
module.exports = app;