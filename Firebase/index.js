const FirebaseAdminAppFirestore = require('firebase-admin/firestore');
const initializeFirebase = require('./main');

initializeFirebase();
const firestore = FirebaseAdminAppFirestore.getFirestore();
const saveThread = async (body) => {
    try{
    const {threadId, deviceId}=body;
    if(!deviceId) {
        return null;
    }
    console.log("document set threadId", threadId, deviceId, body);
    const document = firestore.collection('threadmaps').doc(deviceId);
    console.log("document set threadId before");
    await document.delete();
    console.log("document set threadId");
    await document.set({
        threadId
    });
} catch(e){
    console.error("error here set thread", e);
}

}
const deletethread = async (body) => {
    try{
    const { deviceId}=body;
    if(!deviceId) {
        return null;
    }
    const document = firestore.collection('threadmaps').doc(deviceId);
    console.log("document set threadId before");
    await document.delete();
   
} catch(e){
    console.error("error here set thread", e);
}

}

const getThread = async (body) => {
    try{
        const { deviceId } = body;
        console.log("device id here", deviceId);
        if(!deviceId) {
            return null;
        }
        const document = firestore.collection('threadmaps').doc(deviceId);

        const doc = await document.get();
        const { _fieldsProto: { threadId = {}} = {} } = doc;
        console.error("get thread doc", doc);
        const valueType = threadId?.valueType;
        const threadIdData = threadId?.[valueType];
        return threadIdData;
    } catch(e){
        console.error("error here get thread", body.deviceId);
        return null
    }
  }

  const setChunks = async (body) => {
    try{
    const {placeData, chunks}=body;
    if(!placeData) {
        return null;
    }
    console.log("document set chunks", placeData, chunks);
    const document = firestore.collection('chunkssize').doc(placeData.replaceAll("/","-"));
    console.log("document set threadId before");
    await document.delete();
    console.log("document set threadId");
    await document.set({
        chunks
    });
} catch(e){
    console.error("error here set thread", e);
}

}
const deleteChunks = async (body) => {
    try{
    const { placeData}=body;
    if(!placeData) {
        return null;
    }
    const document = firestore.collection('chunkssize').doc(placeData.replaceAll("/","-"));
    console.log("document set threadId before");
    await document.delete();
   
} catch(e){
    console.error("error here set thread", e);
}

}

const getChunks = async (body) => {
    try{
        const { placeData } = body;
        console.log("place data here", placeData);
        if(!placeData) {
            return null;
        }
        const document = firestore.collection('chunkssize').doc(placeData.replaceAll("/","-"));

        const doc = await document.get();
        const { _fieldsProto: { chunks = {}} = {} } = doc;
        console.error("get chunk data", placeData);
        const valueType = chunks?.valueType;
        const chunkData = chunks?.[valueType];
        return chunkData;
    } catch(e){
        console.error("error here get thread", body.placeData);
        return null
    }
  }

const saveImage = async (body) => {
    try{

        const { imageData, placeData } = body;
        console.log("place data here", placeData);
        if(!placeData) {
            return null;
        }
        const document = firestore.collection('placesimage').doc(placeData.replaceAll("/","-"));
        console.error("set image doc", placeData);
        await document.delete();
        await document.set({
            imageData
        });
    } catch(e){
        console.error("error here save image", e);
    }
}
const deleteImage = async (body) => {
    try{

        const {  placeData } = body;
        if(!placeData) {
            return null;
        }
        const document = firestore.collection('placesimage').doc(placeData.replaceAll("/","-"));
    
        await document.delete();
       
    } catch(e){
        console.error("error here save image", e);
    }
}
const getImage = async (body) => {
    try{
        const { placeData}=body;
        if(!placeData) {
            return null;
        }
        const document = firestore.collection('placesimage').doc(placeData.replaceAll("/","-"));

        const doc = await document.get();
        const { _fieldsProto: { imageData = {}} = {} } = doc;
        console.error("get image doc", placeData);
        const valueType = imageData?.valueType;
        const imageOriginalData = imageData?.[valueType];
        return imageOriginalData;
    }
    catch(e){
        console.error("error here get image", e);
        return null
    }
}

module.exports =  {saveImage, saveThread,getImage, getThread, deletethread,deleteImage, setChunks, deleteChunks, getChunks}