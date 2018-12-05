var rp = require('request-promise');

import consts from "consts/consts"

class PushNotificationsViaFirebase{

    constructor(){


    }

    async sendRequest(title, body){

        var options = {
            method: 'POST',
            uri: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": 'key='+consts.FIREBASE_SECRET
            },
            body: {
                to: "/topics/allDevices",
                priority : "high",
                data: {
                    message: "notificare",
                },
                notification: {
                    body: body,
                    title: title,
                }
            },
            json: true // Automatically stringifies the body to JSON
        };

        console.log("sendingRequest");

        try {

            let answer = await rp(options);

            console.log("answer", answer);

        } catch (exception){
            console.error(exception);
        }

    }

}

export default new PushNotificationsViaFirebase()