const mongoose = require('mongoose');
const config=require('./config/index');
const app = require('./app');

const dbURL=config.MONGO_URL;
mongoose.set('strictQuery', true);

mongoose.connect(dbURL, (err) => {
    if (err) {
        console.error('Couldn\'t Connect to Database 😢');
    } else {
        console.log('Connected to Database');
        app.listen(config.PORT, () => console.log(`Server started on Port ${config.PORT} 😎`));
    }
});
