const express = require('express');
var mysql = require('mysql2');

const app = express();

const { MySQLUsername, MySQLPassword, MySQLDatabase, MySQL_IP, MySQL_Port, compIP, compPort } = require('./cred.js');

var con = mysql.createConnection({
    host: MySQL_IP,
    user: MySQLUsername,
    password: MySQLPassword,
    database: MySQLDatabase,
    port: MySQL_Port,
    multipleStatements: true
});


let IP = compIP;
let PORT = compPort;
app.listen(PORT, IP, function(){
    console.log('Server is running on port ' + PORT);
    console.log('server is running on host: ' + IP);
    console.log('http://' + IP + ':'+ PORT);
});

// app.get('/currentweek/:top', (req, res) => {
//     const top = req.params.top;
//     // There is a MYSQL table with following schema:
//     //      UID (String)
//     //      Name (String)
//     //      Score (Integer)
//     //      Country (ISO 2 letter country code)
//     //      TimeStamp (timestamp)

//     const query = `SELECT * FROM ScoreTable ORDER BY Score DESC LIMIT ${top};`;

//     con.query(query, function (err, result) {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// app.get('/lastweek', (req, res) => {
//     const top = req.params.top;
    
//     const query = 'SELECT UID, Name, Score, Country FROM your_table_name WHERE YEARWEEK(TimeStamp, 1) = YEARWEEK(CURRENT_DATE, 1) ORDER BY Score DESC LIMIT 200;';
    

//     con.query(query, function (err, result) {
//         if (err) throw err;
//         res.send(result);
//     });
// });


app.get('/currentweek', (req, res) => {
    
    // There is a MYSQL table with following schema:
    //      UID (String)
    //      Name (String)
    //      Score (Integer)
    //      Country (ISO 2 letter country code)
    //      TimeStamp (timestamp)

    const query = 'SELECT UID, Name, Score, Country FROM ScoreTable WHERE WEEKOFYEAR(TimeStamp) = WEEKOFYEAR(CURRENT_DATE()) AND YEAR(TimeStamp) = YEAR(CURRENT_DATE()) ORDER BY Score DESC LIMIT 200;';

    con.query(query, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/lastweek/:country', (req, res) => {
    const country = req.params.country;
    
    const query = `SELECT * FROM ScoreTable WHERE Country = ${'country'} AND YEARWEEK(TimeStamp, 1) = YEARWEEK(CURRENT_DATE () - INTERVAL 1 WEEK,1) ORDER BY Score DESC LIMIT 200;`;
    
    con.query(query, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
