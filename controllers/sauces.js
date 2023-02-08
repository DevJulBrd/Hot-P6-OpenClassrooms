const Sauce = require('../models/sauces');

exports.createSauce = (req, res, next) => {
    const sauce = new Sauce ({
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat
    });
    sauce.save()
    .then(() => {
        res.status(201).json({message: 'Sauce sauvegardée !'});
    })
    .catch((error) => {
        res.status(400).json({error: error});
    });
};