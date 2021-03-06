
var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended : false}));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    app.get('/',(req,res) => {
        res.sendFile(__dirname + '/Index.html');
    });

    app.post('/insert',(req,res) => {
        var name=req.body.name;
        var city=req.body.city;
        var sql = "INSERT INTO emp (name, city) VALUES ('"+ name +"','"+ city +"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            //res.send("1 Record Inserted");
            res.redirect('/');
        });
    });

    app.get('/display',(req,res) => {
        var sql = "select * from emp";
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            var html ="<table cellpadding='10' border='1'><tr><td>Id</td><td>Name</td><td>City</td><td>Edit</td><td>Delete</td></tr>";
            for(v of result)
            {
                html +="<tr><td>"+v.id+"</td><td>"+v.name+"</td><td>"+v.city+"</td><td><a href=/edit?id="+v.id+"&name="+v.name+"&city="+v.city+">Edit</a></td><td><a href=/delete?id="+v.id+">Delete</a></td></tr>";
            }
            html +="</table>";
            res.send(html);
        });
    });

    app.get('/delete',(req,res) => {
        var id = req.query.id;
        //res.send(id); print id in browser
        var sql = "delete from emp where id = "+id;
        con.query(sql, function (err, result) {
            if (err) throw err;
            //res.send("1 Record Delete");
            res.redirect('/display');
        });
    });

    app.get('/edit',(req,res) => {
        var id = req.query.id;
        var name = req.query.name;
        var city = req.query.city;
        //res.sendFile(__dirname + '/Index.html');
        var html = "<form action='/update' method='post'>" +
            "<table>" +
            "<tr><td><input type='hidden' name='id' value="+id+"></td></tr>" +
            "<tr><th>Name :</th><td><input type='text' name='name' value="+name+"></td></tr>" +
            "<tr><th>City :</th><td><input type='text' name='city' value="+city+"></td></tr>" +
            "<tr><td><input type='submit' name='submit' value='Update'></td></tr>" +
            "</table>";
        res.send(html);
    });

    app.post('/update',(req,res) => {
        var id = req.body.id;
        var name=req.body.name;
        var city=req.body.city;
        var sql = "update emp set name='"+ name +"',city='"+ city +"' where id = "+id;
        con.query(sql, function (err, result) {
            if (err) throw err;
            //res.send("1 Record Inserted");
            res.redirect('/display');
        });
    });
});
app.listen(3000);