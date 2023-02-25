// Import model
const Sauces = require('../models/sauces');

//Import file system
const fs = require('fs');

// Create sauce 
exports.createSauce = (req, res, next) => {
    // Get all infos from req
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    // Create an object sauce on Sauces 
    const sauce = new Sauces({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    });
    // Save sauce 
    sauce
    .save()
    .then(() => {res.status(201).json({message: "Sauce créée !"})})
    .catch(error => {res.status(400).json({message: error})})
};

// Show all sauce in Sauces
exports.getAllSauces = (req, res, next) => {
    Sauces
    .find()
    .then((allSauces) => res.status(200).json(allSauces))
    .catch((error) => res.status(400).json({error}))
};

// Show a specific sauce
exports.getOneSauce = (req, res, next) => {
    Sauces
    .findOne({_id : req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({error}))
};

// Update a sauce 
exports.updateOne = (req, res, next) => {
    // Delete the old photo
    if(req.file) {
        Sauces
        .findOne({_id: req.params.id})
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/image')[1];
            fs.unlink(`image/${filename}`, (error) => {
                if(error) throw error;
            })
        })
        .catch(error => res.status(404).json({error}))
    }
    // Get all infos from req
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    // Update dataBase
    Sauces
    .findOneAndUpdate({_id : req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: 'Modifications enregistrées'}))
    .catch(error => res.status(400).json({error}))
};

// Delete a sauce
exports.delete = (req,res, next) => {
    // Find the right sauce 
    Sauces
    .findOne({ _id: req.params.id})
    .then(sauce => {
        // Check auth 
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Autorisation refusé !'});
        } else {
            // Delete photo
            const filename = sauce.imageUrl.split('/image/')[1];
            fs.unlink(`image/${filename}`, () => {
                // Delete infos from dataBase
                Sauces
                .deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

// Infos likes/dislikes
exports.likes = (req, res, next) => {
    // Get a specific sauce
    Sauces
    .findOne({_id : req.params.id})
    .then((sauce) => {
        // Differents cases
        switch(req.body.like) {
            // Like 
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

            // Dislike
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

            // Cancel his vote 
            case 0 : 
            // Doesn't like anymore 
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
            // Doesn't dislike anymore
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