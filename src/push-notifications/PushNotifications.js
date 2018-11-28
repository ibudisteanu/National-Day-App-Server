import consts from "consts/consts"

const webpush = require('web-push');

const publicVapidKey = consts.PUSH_NOTIFICATIONS.PUBLIC_KEY;
const privateVapidKey = consts.PUSH_NOTIFICATIONS.PRIVATE_KEY;

// Replace with your email
webpush.setVapidDetails('mailto:val@karpov.io', publicVapidKey, privateVapidKey);

export function initializePushNotifications(app){

    app.post('/subscribe', (req, res) => {

        const subscription = req.body;
        res.status(201).json({});
        const payload = JSON.stringify({ title: 'test' });

        console.log(subscription);

        webpush.sendNotification(subscription, payload).catch(error => {
            console.error(error.stack);
        });

    });

}
