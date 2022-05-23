const  mailQueue = require("./mailQueue.js");
const  fs = require('fs/promises');

// configure
require("dotenv").config();
const  subscriber = require("./redisClient.js");


console.log(mailQueue);
console.log(subscriber);

// creates mails for every user in the list 
async function createMails(receipients,payload){
    try {
        const usersJson = await fs.readFile('./sampleUser.json');
        const users = JSON.parse(usersJson);
        let html,text;
        
        if (payload.isHtml){
            html = `<h1>${payload.subject}</h1>\n<p>${payload.text}</p>`;
        }
        else {
            text = `${payload.subject} \n ${payload.text}`;
        }
        // create mails for all users
        const mails = users.map( user => {
            const mail = {
                from : payload.from,
                to : user.mail_id,
                subject : payload.subject,
            }
            // conditioinally adding html/text to the mail
            html ? mail.html = html : mail.text = text; 
            return mail;
        });
        return mails;
    }
    catch(err){
        console.log(err);
    }
}

// setting transproter mannualy for testing purposes
mailQueue.setMailTransport('garbageinformer@gmail.com','Garbageinformer2');

// making subscriber listen to the event 
const listener = async () => {
    await subscriber.connect();
    try {
        const handler = async function (payloadJson,channel) {
            try {
                console.log(payloadJson);
                const payload = JSON.parse(payloadJson);
                const mails = await createMails(payload.receipients,payload);
                mailQueue.rExtend(mails); // extending mails to  the mails queue
                // starting mail queuue to send mails;
                mailQueue.startMailQueue();
            }
            catch(err){
                console.log('SUBSCRIBER.SUBSCRIBE ',err);
            }
        };
        await subscriber.subscribe('mail',handler);
    }
    catch(err){
        console.log('LISTENER',err);
    }
};
listener();