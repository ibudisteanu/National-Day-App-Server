if(( typeof window !== 'undefined' && !window._babelPolyfill) ||
    ( typeof global !== 'undefined' && !global._babelPolyfill)) {
    require('babel-polyfill')
}

const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path')
const cors = require('cors');
const fs = require('fs')

const resolve = file => path.resolve(__dirname, file)

const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache ? 1000 * 60 * 60 * 24 * 30 : 0
});

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

import consts from 'consts/consts';
import Mongo from "DB/Mongo"
import {QuestionModel, QuestionSchema} from "src/models/Questions/Question.model"
import {AnswerModel, AnswerSchema} from "src/models/Answers/Answer.model"
import {RankingModel, RankingSchema} from "src/models/Ranking/Ranking.model"

import {initializePushNotifications} from "src/push-notifications/PushNotifications"

class APIServer {

    constructor(){

        this._initialized = false;
        this.createAPIServer();
    }

    createAPIServer(){

        let app = new express();
        app.use(cors());

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());

        app.use(cors({ credentials: true }));
        app.use('/.well-known/acme-challenge', serve('./certificates/well-known/acme-challenge', true) );

        this.app = app;

        let options = {};
        let port = consts.PORT;

        try {

            options.key = fs.readFileSync('./certificates/private.key', 'utf8');
            options.cert = fs.readFileSync('./certificates/certificate.crt', 'utf8');
            options.ca = fs.readFileSync('./certificates/ca_bundle.crt', 'utf8');

            this.server = https.createServer( options, app).listen(port, ()=>{

                this._initializeExpress();

                console.log("HTTPS Express was opened on port "+port);

            });

        } catch (exception){

            //cloudflare generates its own SSL certificate
            this.server = http.createServer(app).listen(port, ()=>{

                this._initializeExpress();

                console.log(`http express started at localhost:${port}`)

            });


        }
    }

    _initializeExpress(){

        if (this._initialized)
            return false;

        this._initialized = true;

        this.app.get('/version', (req, res)=>{

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ version: 1 }));

        });

        this.app.get('/'+consts.SECRET.HTTP+'/add-question/:title/:time/:answers', async (req, res)=>{

            let result = false, message= "";

            try{

                let answers = JSON.parse( req.params.answers );

                let answer = await QuestionSchema.statics.saveQuestion(req.params.title, answers, req.params.time);

                if (answer){
                    result = true;
                    message = "success";
                }

            }catch(exception){
                message = exception.message;
            }

            res.setHeader('Content-Type', 'application/json');
            res.send( JSON.stringify({ result: result, message: message } ));

        });

        this.app.get('/'+consts.SECRET.HTTP+'/list-questions', async (req, res)=>{

            let questions = await QuestionSchema.statics.findAll(  );
            let result = [];
            for (let i=0; i < questions.length; i++)
                result.push(questions[i].toJSON(false))


            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));

        });


        this.app.get('/new-questions/:id', async (req, res)=>{

            let result = false, message= "";

            try{

                let id = req.params.id;

                let questions = await QuestionSchema.statics.findAllAfterId(id);

                message = [];
                for (let i=0; i<questions.length; i++ )
                    message.push(questions[i].toJSON(true))


                result = true;

            } catch (exception){
                message = exception.message;
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({result: result, message: message}));

        })

        this.app.get('/question-answer/:device/:id/:answer', async (req, res)=>{

            let result = false, message= "";

            try{

                let id = req.params.id;
                let device = req.params.device;
                let answer = req.params.answer;

                let question  = await QuestionSchema.statics.findQuestion( id );

                if (!question) throw "Question was not found";

                if (answer === question.answers[0]){
                    message = "Correct";

                    await AnswerSchema.statics.saveAnswer(device, question._id.toString());
                    await RankingSchema.statics.updateRanking( device );

                } else {
                    message = "Incorrect";
                }

                result = true;

            } catch (exception){
                message = exception.message;
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({result: result, message: message}));

        })

        this.app.get('/ranking-top-100', async (req, res)=>{

            let result = false, message= "";

            try{

                let ranking  = await RankingSchema.statics.findTop100( );

                message = [];

                for (let i=0; i < ranking.length; i++){
                    message.push( ranking[i].toJSON( ) );
                }

                result = true;

            } catch (exception){
                message = exception.message;
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({result: result, message: message}));

        })

        this.app.post('/ranking-update-device', async (req, res)=>{

            let result = false, message= "";

            try{

                let device = req.body.device;
                let name = req.body.name;
                let email = req.body.email;

                let ranking = await RankingSchema.statics.updateRankingDevice(device, name, email);

                result = true;

            } catch (exception){
                message = exception.message;
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({result: result, message: message}));


        });

        initializePushNotifications(this.app);

    }

}



export default new APIServer();
