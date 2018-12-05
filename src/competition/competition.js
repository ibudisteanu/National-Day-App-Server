import PushNotificationsViaFirebase from "./../push-notifications/PushNotificationsViaFirebase"
import {QuestionSchema} from "../models/Questions/Question.model";

class Competition{

    constructor(){


        this.question = undefined;
        this.questionRoundItem = '';

        this.lastTime = new Date(0);

        setInterval(this.processCompetition.bind(this), 3000 );
    }

    async processCompetition(){

        if (new Date().getTime() - this.lastTime > 60*60*1000){

            this.lastTime = new Date().getTime();

            this.question = await QuestionSchema.statics.findRandomQuestion();
            this.question.deadline = new Date( this.lastTime + 10*60*1000 );


            this.questionItem = Math.floor( Math.random()*1000000000 ) + "_" + Math.floor( Math.random()*1000000000 );

            let title = this.question.title;
            let body = "Răspunde acum la intrebarea din competiţie ca să primeşti puncte!";

            await PushNotificationsViaFirebase.sendRequest(title, body);

        }


        if (new Date().getTime() - this.lastTime > 10*60*1000){

            this.question = undefined;
            this.questionItem = '';

        }

    }


}

export default new Competition();