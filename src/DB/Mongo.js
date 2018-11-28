const mongoose = require('mongoose');

// Use bluebird
mongoose.Promise = require('bluebird');

import consts from 'consts/consts';

class Mongo {

    constructor(){

        this.initializeMongo();
    }

    async initializeMongo(){


        // CONNECTION EVENTS
        // When successfully connected
        mongoose.connection.on('connected',  () => {

            console.warn('MongoDB connected successfully ', consts.DB.CURRENT_DB, consts.DB.HOST);

            this.testMongo();

        });

        // If the connection throws an error
        mongoose.connection.on('error', (err) => {
                console.error('Mongoose default connection error: ' + err);
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected',  () => {
                console.error('Mongoose default connection disconnected');
        });


        await mongoose.connect(`mongodb://${consts.DB.USER}:${consts.DB.PASSWORD}@${consts.DB.HOST}:${consts.DB.PORT}/${consts.DB.CURRENT_DB}`, { useNewUrlParser: true } );

    }

    testMongo(){


    }

}

let mongo = new Mongo();
let ObjectId = mongoose.Types.ObjectId;

export {
    mongoose,
    ObjectId,
    mongo
}
