//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ Global variable
var util = require('util')
var express = require('express');
var app = express();
var multer  = require('multer')
var bodyParser = require('body-parser');
var json = require('express-json');
var Street = require('./streets.js');
var Bourne = require('bourne');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var async = require('async')
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ help function
function helpSplitStrToArr(str){
	return  str.replace(/[^\d,.]/g, '').split(/[,.]/).map(function(val){ return val.substr(0,4) })
}
function helpParseInt(num){
	num = parseInt(num, 10);
	if ( isNaN(num) ){
		return ''
	} else{
		return '' + num
	}
}
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ derivative to varible
var db = new Bourne('testDB.json');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		var hiddenObj = JSON.parse(req.body.hiddenInfo);
		var newDestination = 'public/img/survey/' + hiddenObj['1'];
		var stat = null;
		try {
			stat = fs.statSync(newDestination);
		} catch (err) {
			fs.mkdirSync(newDestination);
		}
		if (stat && !stat.isDirectory()) {
			throw new Error('Directory cannot be created because an inode of a different type exists at "' + newDestination + '"');
		}   
		cb(null, newDestination)
	},
	filename: function (req, file, cb) {
		var hiddenObj = JSON.parse(req.body.hiddenInfo);
		cb(null, hiddenObj['1'] + "_"  + Date.now() + "."+file.mimetype.slice(6))
	}
})

var upload = multer({ storage: storage })
var bodyParser = bodyParser.urlencoded({
	extended: true
})
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ MAIN PART
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(json());
// app.use(bodyParser.urlencoded({
//    extended: true
// }));

app.get("/", (req, res) => {
	res.render("index", {});
});

app.get('/list', function(req, res){
	db.find({}, function(err, result){
		if(err) {
			console.log(err)
		}
		res.render("list", { listResult: result});
	})
})

app.get('/table', function(req, res){
	db.find({}, function(err, result){
		if(err) {
			console.log(err)
		}
		res.render("table", { listResult: result});
	})
})

app.get('/diagram', function(req, res){
	db.find({}, function(err, result){
		if(err) {
			console.log(err)
		}

		res.render("diagram", { listResult: result});
	})
})

app.post('/survey', upload.array('photosOfRoof', 15),function (req, res) {
	var addArr = JSON.parse(req.body.hiddenInfo);
	
	async.waterfall([
		function(callback){
			var parsingObj = {
				key: addArr['1'],
				address : addArr,
				repair : {
					type: req.body.typeOfRoofRepair,
					value: helpParseInt(req.body.valueOfRoofRepair),
					bindingNumbers: helpSplitStrToArr(req.body.bindingNumberOfRoofRepair),
					bindingType: req.body.bindingOfRoofRepair,
					note: req.body.noteOfRoofRepair.trim()
				},
				clear: {
					value: req.body.valueOfRoofClear.replace(/[^\d,.]/g, ''),
					bindingNumbers: helpSplitStrToArr(req.body.bindingNumberOfRoofClear),
					bindingType: req.body.bindingOfRoofClear,
					note: req.body.noteOfRoofClear.trim()
				},
				element: {
					type: req.body.typeOfRoofElementRepair,
					value: helpParseInt(req.body.valueOfRoofElementRepair),
					bindingNumbers: helpSplitStrToArr(req.body.bindingNumberOfRoofElementRepair),
					bindingType: req.body.bindingOfRoofElementRepair,
					note: req.body.noteOfRoofElementRepair.trim()
				},
				glue: {
					type: req.body.typeOfRoofElementGlue,
					value: helpParseInt(req.body.valueOfRoofGlue),
					bindingNumbers: helpSplitStrToArr(req.body.bindingNumberOfRoofGlue),
					bindingType: req.body.bindingOfRoofGlue,
					note: req.body.noteOfRoofGlue.trim()
				},
				metal: {
					type: req.body.typeOfRoofMetalRepair,
					value: helpParseInt(req.body.valueOfRoofMetalRepair),
					bindingNumbers: helpSplitStrToArr(req.body.bindingNumberOfRoofMetalRepair),
					bindingType: req.body.bindingOfRoofMetalRepair,
					note: req.body.noteOfRoofMetalRepair.trim()
				},
				priority: {
					type: req.body.typeOfRoofPriority,
					note: req.body.noteOfRoofPriority.trim()
				},
				photos: []
			};
			callback(null, parsingObj);
		},
		function(parsingObj, callback){
			var parsingObjPhotos = [], i;
			for( i = 0 ; i <= req.files.length; i++){
				if (i == (req.files.length)) {
					callback(null, parsingObj);
					break;
				}
				parsingObj.photos.push(req.files[i].filename)
			}
		},
		function(parsingObj, callback){
			db.insert(parsingObj, function(err, result){
				if(err) {
					console.log(err)
				}
				callback(null, result)
				
			})
			;
		}
		], function (err, result) {
			res.redirect(301, '/')
		}
		);
})

app.get('/check/:id', function(req, res){
	var id = helpParseInt(req.params.id);
	db.findOne({ key : id }, function(err, result){
		if(err) {
			console.log(err)
		}
		if (!result) {
			res.status(200).end('Empty')
		} else {
			res.status(200).end('Included')
		}
	})

	
})

app.post('/street', bodyParser, function (req, res) {
	// Prepare output in JSON format
	response = {
		adress1:req.body.adress1 || 'plant-text',
		adress2:req.body.adress2 || '0',
	};
	var resultArray = Street.filter(function(ads){
		if ((ads['5'].toLowerCase().indexOf(response.adress1.toLowerCase())!=-1)&&(ads['10'].toLowerCase().indexOf(response.adress2.toLowerCase())!=-1)) return true;
		if ((ads['7'].toLowerCase().indexOf(response.adress1.toLowerCase())!=-1)&&(ads['10'].toLowerCase().indexOf(response.adress2.toLowerCase())!=-1)) return true;
		if ((ads['9'].toLowerCase().indexOf(response.adress1.toLowerCase())!=-1)&&(ads['10'].toLowerCase().indexOf(response.adress2.toLowerCase())!=-1)) return true;
	})
	console.log('responseLength', resultArray.length)

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
