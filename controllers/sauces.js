const Sauces = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauces({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    });
    sauce
    .save()
    .then(() => {res.status(201).json({message: "Sauce créée !"})})
    .catch(error => {res.status(400).json({message: error})})
};

exports.getAllSauces = (req, res, next) => {
    Sauces
    .find()
    .then((allSauces) => res.status(200).json(allSauces))
    .catch((error) => res.status(400).json({error}))
};

exports.getOneSauce = (req, res, next) => {
    Sauces
    .findOne({_id : req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({error}))
};

exports.updateOne = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    Sauces
    .findOneAndUpdate({_id : req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: 'Modifications enregistrées'}))
    .catch(error => res.status(400).json({error}))
};

exports.delete = (req,res, next) => {
    Sauces
    .findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Autorisation refusé !'});
        } else {
            const filename = sauce.imageUrl.split('/image/')[1];
            fs.unlink(`image/${filename}`, () => {
                Sauces.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

exports.likes = (req, res, next) => {
    Sauces
    .findOne({_id : req.params.id})
    .then((sauce) => {
        switch(req.body.like) {
            case 1 : 
            if(!sauce.usersLiked.includes(req.body.userId)){
                Sauces
                .updateOne(
                    {_id: req.params.id},
                    {
                        $inc: {likes: 1},
                        $push: {usersLiked: req.body.userId}
                    }
                )
                .then(() => res.status(201).json({message: 'Un like en plus !'}))
                .catch(error => res.status(400).json({error}))
            }
            break;

            case -1 : 
            if(!sauce.usersDisliked.includes(req.body.userId)) {
                Sauces
                .updateOne(
                    {_id: req.params.id},
                    {
                        $inc: {dislikes: 1},
                        $push: {usersDisliked: req.body.userId}
                    }
                )
                .then(() => res.status(201).json({message: 'Un dislike en plus !'}))
                .catch(error => res.status(400).json({error}))
            }
            break;

            case 0 : 
            if(sauce.usersLiked.includes(req.body.userId)) {
                Sauces
                .updateOne(
                    {_id: req.params.id},
                    {
                        $inc: {likes: -1},
                        $pull: {usersLiked: req.body.userId}
                    }
                )
                .then(() => res.status(201).json({message: 'Un like en moins !'}))
                .catch(error => res.status(400).json({error}))
            }
            if(sauce.usersDisliked.includes(req.body.userId)) {
                Sauces
                .updateOne(
                    {_id: req.params.id},
                    {
                        $inc: {dislikes: -1},
                        $pull: {usersDisliked: req.body.userId}
                    }
                )
                .then(() => res.status(201).json({message: 'Un dislike en moins !'}))
                .catch(error => res.status(400).json({error}))
            }
            break;
        }
    })
    .catch(error => res.status(404).json({error}))        
};