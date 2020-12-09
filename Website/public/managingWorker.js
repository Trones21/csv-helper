let memoryAvailable = 0;
let workers = [];
 
 onmessage = function(e){
    console.log(e)
    switch(e.data.msgType){
    case "processData":
        if(e.data.fileList.length === 1){
            workerStuff(e)
        } else{
            handleMultipleFiles(e)
        }
    break;
    case "memoryInfoReceived":
        console.log("Memrec")
        console.log(e.data.memoryAvailable)
        memoryAvailable = e.data.memoryAvailable
    break;
    }
 }

 async function workerStuff(f){
    
    //Note: Single Object cannot be bigger than 1/2 of the CHUNK_SIZE, otherwise I might not be able to parse it
    //Is there any way to show the user this (Not speedily, but if I read the whole file, then yes) 
    let CHUNK_SIZE = 102400000;
    let file = f.data.fileList[0];
    let chunkCount = Math.ceil(file.size / CHUNK_SIZE);
    let options = f.data.options;
    console.log(chunkCount);
    //initial Testing
    // let startIndex = 0;
    
    postMessage({msgType:"memoryInfoRequested"})
    let wait = await (async function() {setTimeout(()=> {console.log("Waited")}), 2000})
    let x = await wait;
    // while(memoryAvailable < 5){
    //     console.log("Waiting for Memory Check")
        
    // }
    
    console.log(memoryAvailable + " mem avail managingWorker")
    // for( let chunkId = 0 ; chunkId < 5; chunkId++){
    //     let testWorker = new Worker("worker.js");
    //     startIndex = chunkId * CHUNK_SIZE;
 
    //     testWorker.postMessage({workerId:chunkId, startIndex:startIndex, CHUNK_SIZE:CHUNK_SIZE, file:file, options: options})
    //     testWorker.onmessage = handleMessage;
    //     workers.push({worker:testWorker, workerId:chunkId, startIndex:startIndex, CHUNK_SIZE:CHUNK_SIZE});
    //     memoryAvailable = 
    //     while(memoryAvailable < memoryNeededPerChunk * 2 ){
    //         //await
    //     }
        
    // }
    // console.log(workers)

}
function handleMessage(e){
    //switch()
    console.log("Worker Finished")
    console.log(e)
    workers.findIndex()
    
    
}

function handleMultipleFiles(e){
    console.log("Multiple Files");
}

function objectArrayEmitter(file){
    let startTime = Date.now();
    var CHUNK_SIZE = 200;
    var offset = 0;
    console.log(file.size)
    console.log(file.size/CHUNK_SIZE + " chunks")        
}

function findMaxDepth(text){
    //Our parser can only process a part of the text it is sent, therefore 
    //we need to find the first TOP level object 
    //ex. ceo: {name:jon, age:45}, revenue:$100},{smallObj:5},{as: xts 
    //We wouldn't want to start parsing at ceo, because it is not the top level object, 
    //but we don't know the level of nesting until we look through the entire chunk of text
    //SmallObj is the 1st top level object. 
    //We should return the charCount for the unprocessed text (before & after). This text will be processed later 
     

}

//CSV Functions
function ConvertToCSV(objArray, masterObj, delimiter) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    //Store some variables on outer loop for Performance
    let masterObjKeyStr = Object.keys(masterObj).toString();
    let masterObjPropCount = Object.keys(masterObj).length;
    
    //Iterate through Object Array 
    for (var i = 0; i < array.length; i++) {
        if(((i/array.length)*100)%10 === 0){
            let pctDone = ((i/array.length)*100)
            postMessage({msgType:"progBar", params:{msg:"Converting: " + pctDone + "%" ,pctDone:pctDone}})

        }
        //Compare Properties 
        if (masterObjKeyStr === Object.keys(array[i]).toString()) {
            str += toCSVString(array[i], delimiter);
        } else {

            //Missing and/or Out of Order Properties
            if (Object.keys(array[i]).length <= masterObjPropCount) {
                let fixedObj = PropsMissingAndOrWrongOrder(masterObj, array[i]);
                str += toCSVString(fixedObj, delimiter)
            }
        }
    }
    return str;
}

function toCSVString(object, delimiter) {
    var line = '';
    for (var index in object) {
        if (line != '')

            line += delimiter

        line += object[index];
    }

    return line + '\r\n';
}

function PropsMissingAndOrWrongOrder(master, objToValidate) {
    let fixedObj = {}
    for (let FindKey of Object.keys(master)) {
        let found = false;
        for (let CheckKey of Object.keys(objToValidate)) {
            if (CheckKey === FindKey) {
                found = true
                fixedObj[FindKey] = objToValidate[FindKey]
                break; //For perf
            }
        
        }

        //Property wasn't found, so we must add a null key 
        if (found === false) {

            fixedObj[FindKey] = "";
        }
    }

    return fixedObj;

}

function determineMasterObject(objArray) {
    let topObjLen = 0;
    let distinctKeys = {};
    let topObject = {};
    for (let obj of objArray) {
        //Grab top object by key count 
        if (Object.keys(obj).length > topObjLen) {
            topObject = obj;
            topObjLen = Object.keys(obj).length;
        }
        //Add distinct keys
        for (let key of Object.keys(obj)) {
            if (!distinctKeys.hasOwnProperty(key)) {
                distinctKeys[key] = '';
            }
        }
    }

    if (Object.keys(distinctKeys).length === Object.keys(topObject).length) {
        return topObject;
    } else {
        console.log("No Object contains full set of Properties. Creating Synthetic Object with distinct keys")
        return distinctKeys;
    }
}

function getCSVstring_PropNamesAsHeaders(objArray, masterObj, delimiter) {
    let headersObj = {};
    headersObj.str = "";
    for (let field in masterObj) {
        headersObj.str = headersObj.str + field + delimiter
    }
    return headersObj.str + '\r\n';
}

function removeDelimiterfromProps(objArr, delimiter) {
    for (let obj of objArr) {
        for (let key in obj) {
            if (typeof obj[key] == "string") {
                obj[key] = obj[key].split(delimiter).join(' ')
            }
        }
    }
    return objArr;

}

function regexReplaceinProps(objArr, expression, replacement) {
    let regex = new RegExp(expression,"g")
    for (let obj of objArr) {
        for (let key in obj) {
            if (typeof obj[key] == "string") {
                obj[key] = obj[key].replace(regex, replacement);
            }
        }
    }
    return objArr;

}

//When the obj has the same property name at multiple levels, you need to differentiate between them
JSON.flatten = function(data) {
    var result = {};
    function recurse(cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++)
                recurse(cur[i], prop ? prop + "." + i : "" + i);
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + "." + p : p);
            }
            if (isEmpty)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}

// function SavedCodeFullFileProcess{
//     //reader.onload = function(f) {
//         postMessage({msgType:"stepList", stepClassName:"loadFileStatus"});
        
//         try{

//         // let data = JSON.parse(f.target.result)
//         // postMessage({msgType:"stepList", stepClassName:"parseFileStatus"});
        
//         // let initialArray = data.map((i)=>JSON.flatten(i))
//         // postMessage({msgType:"stepList", stepClassName:"flattenArrayStatus"});
    

//         // //Prep - I have non-uniform objects so I need to create a masterObject to ensure my columns line up 
//         // let masterObj = determineMasterObject(initialArray)
//         // let headersStr = getCSVstring_PropNamesAsHeaders(initialArray, masterObj, delimiter);
//         // let cleanData = regexReplaceinProps(initialArray, /,/g, " ")
        
//         // //Convert & Write
//         // let recordsStr = ConvertToCSV(cleanData, masterObj, delimiter);
//         // postMessage({msgType:"outputData", headersStr:headersStr, recordsStr:recordsStr})
//         } catch(err){
//             postMessage({msgType:"error", err:err})
//         }

//     }

//     reader.readAsText(e.data.fileList[0]);
// }
