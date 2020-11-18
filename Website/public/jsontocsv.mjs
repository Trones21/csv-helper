


export function convert(){
    console.log("Convert func called")
    const myWorker = new Worker("worker.js");
    let fileNode = document.querySelector('.fileInput');
    myWorker.postMessage({fileList:fileNode.files, delimiter: document.querySelector('#specifyDelimiter').value.trim() || ","});
    myWorker.onmessage = function(e){
        switch(e.data.msgType){
            case "stepList":
                updateStepList(e.data.stepClassName)
                break;
            case "progBar":
                updateProgressBar(e.data.params.msg, e.data.params.pctDone)
                break;
            case "outputData":
                let outfileName = document.querySelector('.fileInput').value.split('\\')[2].split('.')[0]
                updateStepList('convertFileStatus');
                updateProgressBar(`Converted! Writing CSV` , 95)
                writeCSV(e.data.headersStr + e.data.recordsStr, outfileName);
                updateProgressBar(`Finished!` , 100)
                break;
            case "error":
                let errorDiv = document.createElement('div');
                errorDiv.innerText = e.data.err;
                document.getElementsByClassName('modal-body')[0].appendChild(errorDiv);
                break;
            default:
                console.log("Invalid Case sent from Worker")
                break;
        }
    }
}

const updateProgressBar = (Message, pctDone)=>{
    document.querySelector('.progress-bar').setAttribute('aria-valuenow', pctDone);
    document.querySelector('.progress-bar').setAttribute('style', 'width: ' + pctDone + '%');
    document.querySelector('.progress-bar').children[0].innerHTML = Message
} 


const updateStepList = (stepClassName) => {
    let stepList = document.querySelector('.stepList');
    stepList.getElementsByClassName(stepClassName)[0].innerText = '\u2714';
}

export const cleanUpModal = () => {
    let modalBody = document.getElementsByClassName('modal-body')[0];
    modalBody.innerHTML = `<table class="stepList">
    <tr class="step">
        <td class="loadFileStatus"></td>
        <td>Load File</td>
    </tr>
    <tr class="step">
        <td class="parseFileStatus"></td>
        <td>Parse File</td>
    </tr>
    <tr class="step">
        <td class="flattenArrayStatus"></td>
        <td>Flatten Object Array</td>
    </tr>
    <tr class="step">
        <td class="convertFileStatus"></td>
        <td>Convert</td>
    </tr>
</table>
<div class="progress">
    <div class="progress-bar progress-bar-striped active" role="progressbar"
        aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%">
        <span></span>
    </div>
</div>`
}


const handleFilewithoutWorker = () => {
    let fileNode = document.querySelector('.fileInput');
    const fileList = fileNode.files;
    let reader = new FileReader();
    reader.onload = function(e) {
        updateProgressBar("File Loaded", 0);
        try{
        let outfileName = document.querySelector('.fileInput').value.split('\\')[2].split('.')[0]
        let data = JSON.parse(e.target.result)
        updateProgressBar("File Parsed", 0)
        let initialArray = data.map((i)=>JSON.flatten(i))
        updateProgressBar("Array Flattened", 0);
        let delimiter = document.querySelector('#specifyDelimiter').value.trim() || ",";
        
        //Prep - I have non-uniform objects so I need to create a masterObject to ensure my columns line up 
        let masterObj = determineMasterObject(initialArray)
        let headersStr = getCSVstring_PropNamesAsHeaders(initialArray, masterObj, delimiter);
        let cleanData = regexReplaceinProps(initialArray, /,/g, " ")
        
        //Convert & Write
        let recordsStr = ConvertToCSV(cleanData, masterObj, delimiter);
        updateProgressBar(`Finished! Writing File` , 100)
        writeCSV(headersStr + recordsStr, outfileName);
        
        } catch(err){
            console.log(err)
        }

    }

    reader.readAsText(fileList[0])

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
            updateProgressBar(`Converting: ${pctDone}% Done` , pctDone)

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


function writeCSV(cleanData, fileNameNoExt) {

    let data = new Blob([cleanData],{
        type: "text/csv;charset=utf-8"
    });
    let url = window.URL.createObjectURL(data);

    let dLink = document.createElement("a");
    dLink.setAttribute("href", url);
    dLink.download = fileNameNoExt + ".csv";
    dLink.click();
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





