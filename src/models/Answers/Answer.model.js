import {mongoose} from "./../../DB/Mongo"

let ObjectId = mongoose.Types.ObjectId;

let AnswerSchema = new mongoose.Schema({

    device: {type: String},
    question: {type: ObjectId},
    dtCreation: { type: Date, default:  new Date() },

});

AnswerSchema.statics.findAnswer = ( device, question ) => {

    return AnswerModel.findOne ({ 'device' : device, 'question': ObjectId(question) });

};

AnswerSchema.statics.findAll = (  ) => {

    return AnswerModel.find ( { });

};

AnswerSchema.statics.findAllByDevice = ( device  ) => {

    return AnswerModel.find ( { device: device }).sort({'question': -1}).limit(100);

};

AnswerSchema.statics.saveAnswer =  async ( device, question) => {

    let answer = await AnswerSchema.statics.findAnswer(device, question);
    if (answer) return answer;

    answer = new AnswerModel({
        device: device,
        question: ObjectId(question),
    });

    return answer.save();

};

AnswerSchema.methods.toJSON = function (  )  {

    let properties = {
        _id: this._id.toString(),
        device: this.device,
        question: this.question.toString(),
        dtCreation: this.dtCreation.getTime(),
    };

    return properties;
};

let AnswerModel = mongoose.model('Answer', AnswerSchema );

export {
    AnswerSchema,
    AnswerModel,
};

