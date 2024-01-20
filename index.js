const express = require('express');
const path = require('path');
const { connectToMongoDB } = require('./connect');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter')
const URL = require('./models/url');
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb+srv://admin:admin@cluster0.en1paje.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('MongoDb connected'))

app.set('view engine', "ejs");
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/url", urlRoute);

app.use('/', staticRoute);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    }
    );
    res.redirect(entry.redirectURL);
})

app.listen(PORT, () => console.log(`Server Started at Port:${PORT}`));

