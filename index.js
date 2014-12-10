var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//var connection = mongoose.createConnection('mongodb://nodejitsu:60292ea7eca651bf560aafa87f1ced67@troup.mongohq.com:10089/nodejitsudb3469566002');
var connection = mongoose.createConnection('mongodb://localhost/cityroutedb');

var ItemModel = require(__dirname + "/ItemModel").getModel(connection);

app.use(express.static(__dirname + "/app"));
app.use('/bower_components', express.static(__dirname + "/bower_components"));
//app.use('/bower_components', express.static(__dirname + "/cityroutewebapp/bower_components"));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

app.get('/api', function(request, response) {
	console.log('GET /api');
	ItemModel.find(function (error, results) {
		if (error){
			return console.log(error);
		}
		console.log(results);
		return response.send(results);
	});

});

app.get('/api/:table', function(request, response){
	console.log("GET /api/" + request.params.table);
	return ItemModel.find({ParentId:{$exists:false}})
		.sort({Name:1})
		.select("Name ShortName Latitude Longitude")
		.exec(function(error,results){
		if (error){
			return console.log(error);
		}
		console.log(results);
		return response.send(results);
	});
});

// e.g. /api/Country/1 return just Country 1
app.get('/api/:table/:id', function(request, response){

	console.log("GET /api/" + request.params.table + "/" + request.params.id);
	if (request.params.id) {
		return ItemModel.findOne({_id: request.params.id})
			.select("Name ShortName Latitude Longitude Description ParentId Color")
			.exec(function (error, results) {
				//connection.close( );
				if (error) {
					return console.error(error);
				}
				console.log(results);
				return response.send(results);
			});
	}
});

// e.g. /api/Country/1/State   return just all states
app.get('/api/:table1/:id/:table2', function(request, response){
	console.log("GET /api/" + request.params.table1 + "/" + request.params.id + "/" + request.params.table2);
	return ItemModel.find({ ParentId: request.params.id })
		.sort({Name:1})
		.select("Name ShortName Latitude Longitude Description ParentId Color")
		.exec(function(error, results) {
			//connection.close( );
    		if (error) {
      			return console.error(error);
			}
    	return response.send(results);
  });
});

app.post('/api/:table', function(request, response) {
	var item = {}
	if (request.body.Name) {
		item.Name = request.body.Name;
	}
	if (request.body.ShortName) {
		item.ShortName = request.body.ShortName;
	}
	if (request.body.Latitude) {
		item.Latitude = request.body.Latitude;
	}
	if (request.body.Longitude) {
		item.Longitude = request.body.Longitude;
	}
	if (request.body.Description) {
		item.Description = request.body.Description;
	}
	if (request.body.Color) {
		item.Color = request.body.Color;
	}
	if (request.body.ParentId) {
		item.ParentId = request.body.ParentId;
	}

	console.log("POST /api/" + request.params.table + " " + JSON.stringify(item));

	var newitem = new ItemModel(item);
	newitem.save(function (err, results) {
		if (err) {
			return console.log(err);
		}
		response.send(results);
		return console.log("created " + results);
	});

});

app.post('/api/:table1/:id/:table2/',function(request, response) {

	console.log("to update: " + request.body);
	item = new ItemModel({
			Name: request.body.Name,
			ShortName: request.body.ShortName,
			Latitude: request.body.Latitude,
			Longitude: request.body.Longitude,
			Description: request.body.Description,
			Color: request.body.Color,
			ParentId: request.params.id
		});

	item.save(function (err) {
		if (err) {
			return console.log(err);
		}
		return console.log("created");
	});

	response.end();
});

app.put('/api/:table/:id',function(request, response) {

	var item = {}
	if (request.body.Name){
		item.Name = request.body.Name;
	}
	if(request.body.ShortName){
		item.ShortName =request.body.ShortName;
	}
	if(request.body.Latitude){
		item.Latitude = request.body.Latitude;
	}
	if(request.body.Longitude){
		item.Longitude = request.body.Longitude;
	}
	if(request.body.Description){
		item.Description = request.body.Description;
	}
	if(request.body.Color){
		item.Color = request.body.Color;
	}
	if(request.body.ParentId){
		item.ParentId = request.body.ParentId;
	}

	console.log("PUT /api/"+ request.params.table + "/ " + request.params.id + " " + JSON.stringify(item));
	ItemModel.update({_id: request.params.id}, item
		, {
			multi: true
		}, function (error, numberAffected, rawResponse) {
			//connection.close( );
			if (error) {
				return console.error(error);
			}
			console.log(numberAffected + " documents affected");
			console.log(rawResponse);
		}
	);


	response.end();
});

app.put('/api/:table1/:id1/:table2/:id2',function(request, response) {

	console.log("to update: " + request.body);
	ItemModel.update({_id: request.params.id2},
		{
			Name: request.body.Name,
			ShortName: request.body.ShortName,
			Latitude: request.body.Latitude,
			Longitude: request.body.Longitude,
			Description: request.body.Description,
			Color: request.body.Color,
			ParentId: request.params.id1
		}
		, {
			multi: true
		}, function (error, numberAffected, rawResponse) {
			//connection.close( );
			if (error) {
				return console.error(error);
			}
			console.log(numberAffected + " documents affected");
			console.log(rawResponse);
		}
	);


	response.end();
});

function remove(id){
	console.log('deleting item ' + id);
	ItemModel.remove({
		_id:id
	}, function(err, results){
		if (err){
			return console.log(err);
		}
		return console.log(results);
	});
};
function removeIds(id, ids){
	ItemModel.find({ParentId:id})
		.select("_id")
		.exec(function(error,results){
			for(var i=0; i < results.length; i++){
				var res = results[i];
				console.log("_id: " + res._id);
				remove(res._id);
				removeIds(res.id);
			}
		});

	remove(id);
}
app.delete('/api/:table/:id',function(request,response){
	console.log('DELETE /api/' + request.params.table +"/" + request.params.id);
	removeIds(request.params.id);

	/**/
	response.end();
});


var port = 8080;
app.listen(port);
console.log('Server is running at ' + port);
