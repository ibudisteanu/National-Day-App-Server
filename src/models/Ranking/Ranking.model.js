import {mongoose} from "./../../DB/Mongo"
import {AnswerSchema, AnswerModel} from "./../Answers/Answer.model"
import {QuestionSchema, QuestionModel} from "./../Questions/Question.model"

let ObjectId = mongoose.Types.ObjectId;

let RankingSchema = new mongoose.Schema({

    device: {type: String, unique: true},

    name: {type: String},
    email: {type: String},

    questions: {type: Number},
    penality: {type: Number},
    score: {type: Number},

});

RankingSchema.statics.findTop100 = (  ) => {

    return RankingModel.find({}).sort({'score': -1}).limit(100);

};

RankingSchema.statics.findAll = (  ) => {

    return RankingModel.find ( { });

};

RankingSchema.statics.updateRankingDevice =  async ( device, name, email ) => {


    let ranking = await RankingModel.findOne({device: device});
    if (!ranking){
        ranking = new RankingModel({
            device: device
        })
    }

    ranking.name = name;
    ranking.email = email;

    return ranking.save();

}

RankingSchema.statics.updateRanking =  async ( device ) => {

    let ranking = await RankingModel.findOne({device: device});
    if (!ranking){
        ranking = new RankingModel({
            device: device
        })
    }

    let answers = await AnswerSchema.statics.findAllByDevice(device);

    ranking.questions = answers.length;

    let penality = 0;
    if (answers.length > 0){
        let lastQuestion = await QuestionSchema.statics.findQuestion(answers[answers.length-1].question);
        penality = answers[answers.length-1].dtCreation.getTime() - lastQuestion.dtTime.getTime();
    }

    ranking.penality = Math.floor( penality/10000 )/10000;

    ranking.score = 100*ranking.questions - ranking.penality;

    return ranking.save();

};

RankingSchema.methods.toJSON = function ( email = false )  {

    let properties = {
        device: this.device,
        questions: this.questions,
        score: this.score,
        penality: this.penality,
        name: this.name,
        email: email ? this.email : undefined,
    };

    return properties;
};

let RankingModel = mongoose.model('Ranking', RankingSchema );

export {
    RankingSchema,
    RankingModel,
};

