/**
 * Created by dobro on 09.05.17.
 */
let wPi = require('wiring-op');
let fs = require('fs');

let webs = require('ws');

let os = require('os-utils');


const wss = new webs.Server({
    perMessageDeflate: false,
    port: 3000
});

let temp;

wPi.setup('wpi');

wPi.pinMode(8, wPi.OUTPUT);
wPi.pinMode(9, wPi.OUTPUT);

wPi.digitalWrite(9, 0);

value = 0;

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        //console.log('received: %s', message);
        if(message === 'get_temp'){
            ws.send(temp);
        }

        if(message === 'get_cpu'){
           os.cpuUsage(function (result) {
               ws.send(result);
            });
        }

        if(message === 'get_total_mem'){
           os.totalmem(function (result) {
               ws.send(result);
           });
        }

        if(message === 'get_free_mem'){
            os.freemem(function (result) {
                ws.send(result);
            });
        }

    });
});

setInterval(function() {
    fs.readFile('/sys/devices/virtual/thermal/thermal_zone0/temp', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        temp = Number(data);
        //console.log(temp);



        if(temp <= 43){
            wPi.digitalWrite(9, 1);
            wPi.digitalWrite(8, 1);
        } else if(temp >= 60 && temp < 63){
            wPi.digitalWrite(9, 0);
            wPi.digitalWrite(8, 1);
        } else if(temp >= 70 ){
            wPi.digitalWrite(9, 0);
            wPi.digitalWrite(8, 0);
        }

    });

}, 1000);