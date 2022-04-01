var express = require('express');
bodyParser = require('body-parser');
app = express();
port = process.env.PORT || 4000;

// protection CORS 
var cors = require('cors');
const corsOptions = {
	allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors());
// parsing json 
app.use(bodyParser.json());

// Import des routes
require('./duel')(app);
require('./partie')(app);

app.listen(port, () => {
	console.log('Server started on: ' + port);
});