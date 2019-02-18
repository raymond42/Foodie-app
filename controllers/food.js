const Sauce = require('../models/sauce');
const fs = require('fs');
const auth = require('../middleware/auth');
const User = require('../models/user');

exports.createSauce = (req, res, next) =>{
	//req.body.sauce = JSON.parse(req.body.sauce);
	let data = JSON.parse(req.body.sauce);
	//const url = req.protocal + '://' + req.get('host');
	const sauce = new Sauce({
		name: data.name, 
		manufacturer: data.manufacturer, 
		description: data.description, 
		mainPepper: data.mainPepper, 
		imageUrl: 'http://' + req.get('host') + '/images/' + req.file.filename, 
		heat: data.heat,
		userId : data.userId
	});
	sauce.save().then(
		() =>{
			res.status(201).json({message: 'Sauce saved successfully'});
		}
	).catch(
		(error) =>{
			res.status(400).json({error:error});
		}
	);
};

exports.getOneSauce = async (req, res, next) =>{
	const found = await Sauce.findById({_id: req.params.id});
	if (found) return res.status(200).send(found);	
};

exports.getAllSauce = (req, res, next) =>{
	Sauce.find().then(
		(sauces) =>{
			res.status(200).json(sauces);
		}
	).catch(
		(error)=>{
			res.status(400).json({error:error});
		}
	);
}

exports.modifySauce = async (req, res, next) =>{
	let sauce = new Sauce({ _id : req.params._id });
	if (req.file){
		//const filename = sauce.imageUrl.split('/images/')[1];
      	//fs.unlink('images/' + filename, () => {
      		let data = JSON.parse(req.body.sauce);
		//const url = req.protocal + '://' + req.get('host');
			sauce = {
				_id: req.params.id,
				name: data.name, 
				manufacturer: data.manufacturer, 
				description: data.description, 
				mainPepper: data.mainPepper, 
				imageUrl: 'http://' + req.get('host') + '/images/' + req.file.filename, 
				heat: data.heat,
				//userId : data.userId
			};
		
	}else{
		//console.log(req.body);
		sauce = {
			_id: req.params.id,
			name: req.body.name, 
			manufacturer: req.body.manufacturer, 
			description: req.body.description, 
			mainPepper: req.body.mainPepper, 
			//imageUrl: req.body.imageUrl, 
			heat: req.body.heat,
			//userId : req.body.userId
		};
	}
	//Find sauce 
	const found = await Sauce.findOne( { _id: req.params.id } );
	//Find existing file name
	filename = found.imageUrl.split('/images/')[1];
	//fs.unlink
	fs.unlink('images/' + filename, () => {
	Sauce.updateOne({ _id: req.params.id }, sauce).then(
		()=>{
			//console.log()
			res.status(201).json({ message: 'Sauce updated successfully!' });
		}
	).catch(
		(error)=>{
			error:error
		}
	);
});
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        Sauce.deleteOne({_id: req.params.id}).then(
          () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    }
  );
};

//likes
exports.like = async (req, res, next) =>{
	//console.log(req.body);
	const sauceFound =  await Sauce.findOne({ _id:req.params.id });
	const user = await User.findOne({_id:req.body.userId});
	//console.log(user);

	//Liking the sauce
	//Check first if the user has already liked the sauce or not
	if (req.body.like === 1) {
		if (sauceFound.usersLiked.filter(like =>  
		like.toString() === user.email.toString()).length >0){

			res.send({message: 'user has already liked this sauce!!'});
			console.log(' user has already liked this sauce!! ');

		}else{
			//Add userId to the userLiked array
			//First we need to cancel the dislike
			sauceFound.likes++;
			if (sauceFound.likes === 0) {
				sauceFound.likes = 0;
				res.send({ likes: sauceFound.likes });
			}
			// User added to users who liked the sauce
			sauceFound.usersLiked.unshift(user.email.toString());

			//Removing the user from the array of disliked users
			//console.log(sauceFound);
			if (sauceFound.usersDisliked.filter(like => like.toString() === user.email.toString()).
				length>0) {

					sauceFound.dislikes--;
					sauceFound.usersDisliked.shift(user.email.toString());
			}

		}

		await sauceFound.save();
		res.send({ message: 'Sauce liked!' });
	}
	
//For Dislike
	if (req.body.like === -1) {
		//console.log(req.body.like);
		if (sauceFound.usersDisliked.filter(like =>  
		like.toString() === user.email.toString()).length >0){
				res.status(401).send({message: 'user has already disliked this sauce!!'});
				console.log(' user has already liked this sauce!! ');
	
		}else{
			//Add userId to the userDisliked array
			//First we need to cancel the like
			sauceFound.dislikes++;
			if (sauceFound.dislikes === 0) {sauceFound.dislikes = 0;
				res.send({ dislikes: sauceFound.dislikes });
			}
			// User added to users who disliked the sauce
			//console.log(user);
			sauceFound.usersDisliked.unshift(user.email.toString());

			//Removing the user from the array of liked users
			if (sauceFound.usersDisliked.filter(like => like.toString() === user.email.toString()).
				length>0) {
					sauceFound.likes--;
					sauceFound.usersLiked.shift(user.email.toString());
			}

		}

		await sauceFound.save();
		res.send({ message: 'Sauce Disliked!' });
	}
};

