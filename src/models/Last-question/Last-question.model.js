import {mongoose} from "./../../DB/Mongo"
import {QuestionSchema, QuestionModel} from "./../Questions/Question.model"


let ObjectId = mongoose.Types.ObjectId;

let LastQuestionSchema = new mongoose.Schema({

    question: {type: ObjectId},
    dtTime: { type: Date, default:  new Date() },

});

LastQuestionSchema.statics.findLastQuestion = async ( ) => {

    let answer = await QuestionModel.findAll ({ });

    if (answer.length === 0)
        answer = null;
    else
        answer = answer[0];

    return answer;

};

LastQuestionSchema.statics.getNextLastQuestion =  asnyc ( ) => {

    var lastQuestion = await LastQuestionSchema.statics.findLastQuestion();
    var questionId = '';

    if (lastQuestion) questionId = lastQuestion.question.toString();

    let questions = await QuestionSchema.statics.findAllAfterId(questionId);

    if (questions.length > 0){

        if (!lastQuestion)
            lastQuestion = new LastQuestionModel( {  } );

        lastQuestion.question = questions[0]._id;
        lastQuestion.dtTime = new Date();

        await lastQuestion.save();

        return lastQuestion;

    } else {

        return undefined;

    }

};


let LastQuestionModel = mongoose.model('LastQuestion', LastQuestionSchema );

export {

    LastQuestionSchema,
    LastQuestionModel,

};
