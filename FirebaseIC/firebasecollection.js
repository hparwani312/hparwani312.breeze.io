// const FirebaseAdminAppFirestore = require('firebase-admin/firestore');
// const initializeFirebase = require('./main');

// initializeFirebase();
// const firestore = FirebaseAdminAppFirestore.getFirestore();


// const getcollectiondata = async (body) => {
//     try{
//         const { placeData } = body;
//         console.log("place data here", placeData);

       
//         if(!placeData) {
//             return null;
//         }
//         const placeFirstName  = placeData.split(",")[0].trim();

//         const document = firestore.collection('chunkssize');
//         const doc = await document.get();
//         let currentDocType = "";

        
//         doc.forEach(docType => {

//             // console.log("current doc type", docType.id);
//            if(docType.id.includes(placeFirstName) && !currentDocType) {
//             currentDocType=docType.id
//            }
//         });
//         console.log("current doc type", currentDocType);
//         // const document = firestore.collection('chunkssize').doc(placeData.replaceAll("/","-"));

//         // const doc = await document.get();
//         // const { _fieldsProto: { chunks = {}} = {} } = doc;
//         // console.error("get chunk data", placeData);
//         // const valueType = chunks?.valueType;
//         // const chunkData = chunks?.[valueType];
//         // return chunkData;
//     } catch(e){
//         console.error("error here get thread", body.placeData);
//         return null
//     }

// }

// getcollectiondata({placeData: 'Whisky Samba, Global Foyer Mall, Sector 43, Golf Course Road, Gurgaon, Haryana 122009, India'})