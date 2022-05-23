const { createClient } = require('redis');

// creating redis client
const subscriber = createClient({
	url : process.env.REDIS_URL,
    password : process.env.REDIS_PASS,
});

// connecting to the client 
    // (async () => {
        
    //     try {
    //         connection = await subscriber.connect();
    //         if (connection){
    //             console.log(connection);
    //         }
    //     }
    //     catch(err){
    //         console.log('ERROR WHILE CONNECTING REDIS',err);
    //     }
            
    // })();

// export client object to index.js 
// where it will listen for subscribed event
module.exports = subscriber;















// subscriber.connect().catch(console.log);
// subscriber.subscribe('message');
// (async () => {
//     const handler = async function(message,channel){
//         console.log(channel, " - ", message);
//     }
//     // subscriber.on('message');
//     subscriber.subscribe('mess',handler);
// })();