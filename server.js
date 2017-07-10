var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var json = require('express-json');
var Street = require('./streets.js')
var Bourne = require('bourne')
var db = new Bourne('test.json')
var _ = require('underscore')

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(express.static('public'));
app.use(json());
app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})
app.set('view engine', 'jade');

app.post('/table', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   response = {
      adress: JSON.parse(req.body.hid),
      clear:req.body.clearVal,
      repair:[req.body.repairVal, req.body.repairElem],
      glue: [req.body.glueVal, req.body.glueElem],
      reinforce: req.body.reinforceVal,
      luminaire:req.body.luminaireVal,
      notes:req.body.notes,
      priority:req.body.priority
   };
   db.insert(response, function(err, result){
      if (err) console.log(err)
      console.log(result);
      res.redirect(301, '/')
   })

})

app.post('/street', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   response = {
      adress1:req.body.adress1 || '',
      adress2:req.body.adress2 || 0,
   };

   var resultArray = Street.filter(function(ads){
    if ((ads['5'].toLowerCase().indexOf(response.adress1.toLowerCase())!=-1)&&(ads['10'].toLowerCase().indexOf(response.adress2.toLowerCase())!=-1)) return true;
    if ((ads['7'].toLowerCase().indexOf(response.adress1.toLowerCase())!=-1)&&(ads['10'].toLowerCase().indexOf(response.adress2.toLowerCase())!=-1)) return true;
    if ((ads['9'].toLowerCase().indexOf(response.adress1.toLowerCase())!=-1)&&(ads['10'].toLowerCase().indexOf(response.adress2.toLowerCase())!=-1)) return true;
 })
   console.log(response, resultArray)

   res.json(resultArray);
})

app.get('/result', function(req, res){
   var result = db.find({}, function(err, objs){
      if (err) console.log(err)
      // var sorObjs = _.sortBy(objs, ['adress']['3']);
      console.log(objs)
      res.render('result', { tableResult: objs});
   })
})

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)

})
