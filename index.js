require('dotenv').config();
const express = require( 'express' );
const cors = require('cors');
const logrequest = require('./middlewares/loggers.js');
const errorhandler = require('./middlewares/errorHandler.js');
const connectDB = require('./database/db.js');
const articleRoutes = require('./routes/article.route.js');
const UserRoutes = require('./routes/user.route.js');

const app = express();
app.use(logrequest);


//body parsing middleware
app.use( express.json() );

app.use('/api', articleRoutes);
app.use('/api/users/', UserRoutes);

app.use(errorhandler);

const corsOptions = {
  origin: 'http://example.com'
};
app.use(cors(corsOptions));

connectDB();






const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
