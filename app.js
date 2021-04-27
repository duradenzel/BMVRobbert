const express = require('express')
const app = express()
const path = require('path')
const mysql = require('mysql');
var bodyParser = require('body-parser');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'))
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));
app.use('/src/', express.static(path.join(__dirname, 'node_modules/three/src/src')));

app.listen(3000, () =>
  console.log('Visit http://127.0.0.1:3000')
);

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "threejs"
})

con.connect();

app.get("/api", (req,res) =>{
  
 // console.log(req);
  con.query("SELECT * FROM meshes", function(err, result){
     
    if (err) throw err;
      else{
          res.send(result);
          
      }
  });
});

app.get("/getfloors", (req,res) =>{
  
  // console.log(req);
   con.query("SELECT * FROM floors", function(err, result){
      
     if (err) throw err;
       else{
           res.send(result);
           
       }
   });
 });



app.put("/update", (req,res) =>{
  var data = req.body;
  console.log(data);
  var sql = `UPDATE meshes
  SET meshName = ?,
  meshDesc = ?,
  meshSector = ?
  WHERE meshId = ?`;
  con.query(sql, data, (error, results, fields) => {
    if (error){
      return console.error(error.message);
    }
    console.log('Rows affected:', results.affectedRows);
    res.send();
  });
  
   
 });

 app.put("/updatefloor", (req,res) =>{
  var data = req.body;
  console.log(data);
  var sql = `UPDATE floors
  SET floorName = ?,
  floorActivity = ?
  WHERE floorName = ?`;
  con.query(sql, data, (error, results, fields) => {
    if (error){
      return console.error(error.message);
    }
    console.log('Rows affected:', results.affectedRows);
    res.send();
  });
  
   
 });
 






