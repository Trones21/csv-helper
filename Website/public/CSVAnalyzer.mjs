//Get the completion rates of a CSV

export default function analyzerMain(){
    console.log("analyzing")
    let fileNode = document.querySelector('.uiCSVAnalyzer').getElementsByClassName("fileInput")[0]
    let analysisWorker = new Worker("analysisWorker.js");
    console.log(fileNode.files[0])
    //Split into chunks if the filesize is X
    if(fileNode.files[0].size < 104857600){
        analysisWorker.postMessage(fileNode.files[0])
        analysisWorker.onmessage = analysisWorkerMessage;
    }else{
        
    }

    
}

function analysisWorkerMessage(e){
    console.log("Msg from analysis worker")
    console.log(e.toString());
}

// let completionRates = getCompletionRates(initialObject);
// let headersStr = getCSVstring_PropNamesAsHeaders(completionRates,",");
// let recordsStr = ConvertToCSV(completionRates, ",");
// writeCSV(headersStr + recordsStr , "Test");

function ConvertToCSV(objArray, delimiter) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '')

                line += delimiter

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function writeCSV(cleanData, fileName) {

    let data = new Blob([cleanData],{
        type: "text/csv;charset=utf-8"
    });
    let url = window.URL.createObjectURL(data);

    let dLink = document.createElement("a");
    dLink.setAttribute("href", url);
    dLink.download = fileName + ".csv";
    dLink.click();
}



function getCSVstring_PropNamesAsHeaders(objArray, delimiter){
    let headersObj = {};
    headersObj.str = "";
    for(let field in objArray[0]){
        headersObj.str = headersObj.str + field + delimiter  
    }
    return headersObj.str + '\r\n';
}

function removeDelimiterfromProps(objArr, delimiter){
    for (let obj of objArr) {
        for (let key in obj) {
            if (typeof obj[key] == "string") {
                obj[key] = obj[key].split(delimiter).join(' ')
            }
        }
    }
    return objArr;

}

function regexReplaceinProps(objArr, expression, replacement){
    let regex = new RegExp(expression, "g")
    for (let obj of objArr) {
        for (let key in obj) {
            if (typeof obj[key] == "string") {
                obj[key] = obj[key].replace(regex, replacement);
            }
        }
    }
    return objArr;

}