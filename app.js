// Import express
const express = require('express');
const app = express();
// Import mongoose
const mongoose = require('mongoose');
// Import routers
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
// Import dotenv
const dotenv = require('dotenv');
const result = dotenv.config();
// Import path
const path = require('path');


// Connection dataBase mongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/piquante?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS policy
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Content, Authorization');
  next();
});

// json process
app.use(express.json());
// Image process
app.use('/image', express.static(path.join(__dirname, 'image')));


// Root user
app.use('/api/auth', userRoutes);
// Root sauce
app.use('/api/sauces', saucesRoutes);



module.exports = app;