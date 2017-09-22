const mongoose = require('mongoose');
const express = require('express');

const Product = require('./Product');
const upload = require('./uploadConfig');

mongoose.Promise = global.Promise;
const uri = 'mongodb://localhost/shop';

mongoose.connect(uri, { useMongoClient: true });
mongoose.connection.once('open', () => {
    app.listen(3000, () => console.log('Server started!'));
});


const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', (req, res) => {
    Product.find({})
    .then(products => res.render('index', { products }));
});

app.get('/add', (req, res) => res.render('add'));

app.get('/admin', (req, res) => res.render('admin'));

app.post('/add', upload.single('image'), (req, res) => {
    const { name, video, desc } = req.body;
    const image = req.file ? req.file.filename : 'default.jpg';
    const product = new Product({ name, video, desc, image });
    product.save()
    .then(() => res.redirect('/'))
    .catch(err => res.send(err.message));
});
