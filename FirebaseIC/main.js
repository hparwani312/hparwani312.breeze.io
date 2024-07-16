
const FirebaseAdminApp  = require('firebase-admin/app');

let appInitialized = null;

function firebaseinitialize() {
    const serviceAccount = require("./credentials/goapedia-79fad-firebase-adminsdk-ezg2m-fc7216745c.json");
    if(!appInitialized) {
        appInitialized=FirebaseAdminApp.initializeApp({
            credential: FirebaseAdminApp.cert(serviceAccount),
            
        }, 'tryfirebase1');
    }
    return appInitialized;
}

module.exports = firebaseinitialize;