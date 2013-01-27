exports.index = function (req, res) {
	var
	fs		= require('fs'),
	file	= 'user.json',
	path	= 'data/';
	//Check if file exists
	fs.exists('data/user.json', function (exists) {
		if(exists){
			console.log('yes');
		} else {
			console.log('no');
			//Create file
			fs.open(path + file, 'w', function (err) {
				console.log('file created');
				//Create a new object for customers
				var newJSONForm = newJSONForm || {};
				newJSONForm.customer = {};
				//add it to the file
				fs.writeFile(path + file,JSON.stringify(newJSONForm,null,4),function(err){
					if(err){
						console.log('file did not write');
					} else {
						console.log('Customer object added to file');
					}
				});
			});
		}
	});

	//create a oabject from the form
	var formData = {
		firstname	: req.param('firstname'),
		lastname	: req.param('lastname'),
		date		: req.param('date'),
		phoneNumber	: req.param('phoneNumber'),
		NoOfPeople	: req.param('NoOfPeople'),
		email		: req.param('email'),
		checked		: req.param('checked')
	};

	var existingData = {};
	fs.readFile(path + file,'utf8', function(err,data){
		if (err){
			return console.log(err);
		}
		var newData = JSON.parse(data);
		console.log(newData);

		var customers = customers || {};

		var i = 0, item;
		for (item in newData["customers"]){
			i = i + 1;
		}
		var id = i +1;
		var x = newData["customers"];

		x[id] = formData;
		var addJSON = addJSON || {};
		addJSON["customers"] = x;
		fs.writeFile(path + file,JSON.stringify(addJSON,null,4),function(err){
			if(err){
				console.log('file did not write');
			} else {
				console.log('success');
			}
		});

	});
};

exports.send =  function(req,res){
	var
	fs		= require('fs'),
	file	= 'user.json',
	path	= 'data/';

	fs.readFile(path + file,'utf8', function(err,data){
		if (err){
			return console.log(err);
		}
		res.send(data);
	});
};

exports.edit = function(req,res){
	var formData = {
		checked	: req.param('customerNo'),
		status	: req.param('status')
	};
	// Get Customer KEY
	var
	customerNo = formData.checked,
	fs		= require('fs'),
	file	= 'user.json',
	path	= 'data/';

	fs.readFile(path + file,'utf8', function(err,data){
		if (err){
			return console.log(err);
		}
		var newData = JSON.parse(data);
		var i ,key, result = '';
		for(key in newData['customers']){
			customerDetails = newData['customers'][customerNo];
		}

		//Add new status to customer object
		customerDetails.checked = formData.status;
		newData['customers'][customerNo] = customerDetails;
		var updatedData = newData;

		fs.writeFile(path + file,JSON.stringify(updatedData,null,4),function(err){
			if(err){
				console.log('file did not write');
			} else {
				console.log('success');
			}
		});
	});
};
