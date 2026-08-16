
const express = require( 'express' );
const cors = require('cors');
const logrequest = require('./middlewares/loggers.js');
const errorhandler = require('./middlewares/errorHandler.js');
const articleRoutes = require('./routes/article.route.js');
const UserRoutes = require('./routes/user.route.js');

const app = express();
app.use(logrequest);
app.use(cors('*'));

//body parsing middleware
app.use( express.json() );

app.use('/api', articleRoutes);
app.use('/api/users/', UserRoutes);

app.use(errorhandler);



module.exports = app;