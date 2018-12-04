import {mongoose} from "./../../DB/Mongo"

let QuestionSchema = new mongoose.Schema({

    title: { type: String, default: '' },
    answers: { type: Array, default: '' },

    dtCreation: { type: Date, default:  new Date() },
    dtTime: { type: Date, default:  new Date() },

});

QuestionSchema.statics.findQuestion = ( id ) => {

    return QuestionModel.findOne ({ '_id' : ObjectId(id) });

};

QuestionSchema.statics.findAll = (  ) => {

    return QuestionModel.find ( { dtTime: { $lte : new Date() } } );

};

QuestionSchema.statics.findActiveQuestion = (  ) => {

    let time = new Date().getTime();

    return QuestionModel.findOnce ( { dtTime: { $lte : new Date( time + 10*60*1000 ), $gte : new Date(time) } } );

};

QuestionSchema.statics.findAllAfterId = ( id ) => {

    if (id.length < 24) id = "0000000000013b2c643f1216";

    return QuestionModel.find ( { _id : { $gt: ObjectId(id) }, dtTime: { $lte : new Date() } });

};

QuestionSchema.statics.saveQuestion =  ( title, answers, dtTime ) => {

    if (dtTime === 0) dtTime = new Date().getTime();

    if (dtTime === undefined || dtTime === 0) dtTime = new Date().getDate();

    let model = new QuestionModel ({

        title: title,
        answers: answers,
        dtTime: dtTime,

    });

    return model.save();

};

QuestionSchema.methods.toJSON = function ( scramble = true )  {

    let properties = {
        _id: this._id.toString(),
        title: this.title,
        dtTime: this.dtTime.getTime(),
        dtCreation: this.dtCreation.getTime(),
        answers: this.answers
    }

    if (scramble){
        properties.answers = shuffle(properties.answers);
    }

    return properties;
};

let QuestionModel = mongoose.model('Question', QuestionSchema );
let ObjectId = mongoose.Types.ObjectId;

export {
    QuestionSchema,
    QuestionModel,
};





function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
