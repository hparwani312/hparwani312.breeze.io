const FirebaseAdminAppFirestore = require('firebase-admin/firestore');
const initializeFirebase = require('./main');

const anotherApp = initializeFirebase();
const firestore = FirebaseAdminAppFirestore.getFirestore(anotherApp);
const saveUser = async (body) => {
    try{
    const {icAuthId, username, password}=body;
    if(!icAuthId) {
        return null;
    }
   
    const document = firestore.collection('user').doc(icAuthId);
    console.log("document set user before");
    await document.delete();
    console.log("document set user");
    await document.set({
        username,
        password,

    });
} catch(e){
    console.error("error here set user", e);
}

}

const updateUser = async (body) => {
    try{
        const {icAuthId, token, paymentId, apiKey, apiSecret }=body;
        if(!icAuthId) {
            return null;
        }
       
        const document = firestore.collection('user').doc(icAuthId);
        if(paymentId){
            await document.update({
                paymentId,
                token,
                apiKey,
                apiSecret
            });
        } else {
            await document.update({
                token
            });
        }
    } catch(e){
        console.error("error here set user", e);
    }
}

const updateExpiryDate = async (body) => {
    try{
        const {icAuthId, expiryDate}=body;
        if(!icAuthId) {
            return null;
        }
       
        const document = firestore.collection('user').doc(icAuthId);

            await document.update({
                expiryDate
            });
        
    } catch(e){
        console.error("error here set user", e);
    }
}
const deleteUser = async (body) => {
    try{
    const { icAuthId}=body;
    if(!icAuthId) {
        return null;
    }
    const document = firestore.collection('user').doc(icAuthId);
    console.log("document delete user before");
    await document.delete();
   
} catch(e){
    console.error("error here delete user", e);
}

}

const getUser = async (body) => {
    try{
        const { icAuthId } = body;
        if(!icAuthId) {
            return null;
        }
        const document = firestore.collection('user').doc(icAuthId);

        const doc = await document.get();
        const { _fieldsProto: { username = '', expiryDate = '', password=''} = {} } = doc;
        console.error("get thread doc", doc);
        let userExists = false;
        let userActive = false;
        let passwordOne = '';

        if(username) {
            const valueTypeUsername = username?.valueType;
            const usernameData = username?.[valueTypeUsername];
            userExists = !!usernameData;
        }
        if(expiryDate) {
            const valueTypeExpiry = expiryDate?.valueType;
            const expiryData = expiryDate?.[valueTypeExpiry];
            userActive = Date.now()<expiryData;
        }
        if(password){
            const valueTypePassword = password?.valueType;
            passwordOne = password?.[valueTypePassword];
        }

       
        return {userExists, userActive, password: passwordOne};
    } catch(e){
        console.error("error here get user", body.icAuthId);
        return null
    }
  }

 
module.exports =  {saveUser, getUser, deleteUser, updateUser,updateExpiryDate}