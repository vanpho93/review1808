const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uri = 'mongodb://localhost/shop';

mongoose.connect(uri, { useMongoClient: true });
mongoose.connection.once('open', () => {
    app.listen(3000, () => console.log('Server started!'));
});

const Product = require('./Product');

const express = require('express');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', (req, res) => {
    Product.find({})
    .then(results => res.send(results));
});
