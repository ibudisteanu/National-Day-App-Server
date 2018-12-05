var rp = require('request-promise');

import consts from "consts/consts"

class PushNotificationsViaFirebase{

    constructor(){


    }

    async sendRequest(){

        var options = {
            method: 'POST',
            uri: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": 'key='+consts.FIREBASE_SECRET
            },
            body: {
                to: "/topics/test-channel",
                data: {
                    message: "xxx",
                },
                message:{
                    topic: "notificare-automata",
                    notification: {
                        body: "Notificare",
                        title: "TITLU",
                    }
                }
            },
            json: true // Automatically stringifies the body to JSON
        };

        console.log("sendingRequest")

        try {

            let answer = await rp(options);

            console.log("answer", answer);

        } catch (exception){
            console.error(exception);
        }

    }

}

export default new PushNotificationsViaFirebase()