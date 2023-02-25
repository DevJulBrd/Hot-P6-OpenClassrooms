// Import package
const multer = require('multer');

// Define the accepted images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Save images 
const storage = multer.diskStorage({
    // Where images aez stocked 
    destination : (req, file, callback) => {
        callback(null, 'image');
    },
    // Named image 
    filename : (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage : storage}).single('image');
