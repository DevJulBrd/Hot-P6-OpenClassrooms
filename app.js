const express = require('express');
const app = express();
const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const dotenv = require('dotenv');
const result = dotenv.config();
const path = require('path');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Vous effectuez trop de requête vers la base de donnée. Celà peut s'apparenter à du spam"
});




mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/piquante?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Content, Authorization');
  next();
});

app.use(express.json());
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use(limiter);

app.use('/api/auth', userRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);



module.exports = app;