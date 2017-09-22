const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');

const Product = require('./Product');
const upload = require('./uploadConfig');

mongoose.Promise = global.Promise;
const uri = 'mongodb://pho:123@ds147304.mlab.com:47304/shop';

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
    .then(products => res.render('admin', { products }));
});

app.get('/add', (req, res) => res.render('add'));

app.get('/admin', (req, res) => {
    Product.find({})
    .then(products => res.render('admin', { products }));
});

app.get('/xoa/:id', (req, res) => {
    const { id } = req.params;
    Product.findByIdAndRemove(id)
    .then((product) => {
        res.redirect('/admin');
        if(product.image === 'default.jpg') return;
        const path = './public/images/background/' + product.image;
        fs.unlink(path, (err) => {
            if(err) console.log(err.message);
        });
    })
    .catch(err => res.send(err.message));
});

app.get('/sua/:id', (req, res) => {
    const { id } = req.params;
    Product.findById(id)
    .then(product => res.render('edit', { product }));
});

app.post('/update/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, video, desc, oldImage } = req.body;
    const image = req.file ? req.file.filename : oldImage;
    Product.findByIdAndUpdate(id, {name, video, desc, image })
    .then(() => {
        res.redirect('/admin');
        if(!req.file) return;
        const path = './public/images/background/' + oldImage;
        fs.unlink(path, (err) => {
            if(err) console.log(err.message);
        });
    })
});

app.post('/add', upload.single('image'), (req, res) => {
    const { name, video, desc } = req.body;
    const image = req.file ? req.file.filename : 'default.jpg';
    const product = new Product({ name, video, desc, image });
    product.save()
    .then(() => res.redirect('/'))
    .catch(err => res.send(err.message));
});
