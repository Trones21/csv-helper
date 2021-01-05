//Get the completion rates of a CSV
let completionRates = getCompletionRates(initialObject);
let headersStr = getCSVstring_PropNamesAsHeaders(completionRates,",");
let recordsStr = ConvertToCSV(completionRates, ",");
writeCSV(headersStr + recordsStr , "Test");

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

function getCompletionRates(objArray){
    //Assumes all objects have the same properties
    //Count Properties
    let outArr = [];
    for(let k in objArray[0]){
        let field = k;
        let nonNullCount = 0;
        let recordCount = 0;
        for(let i of objArray){
           recordCount += 1;
           nonNullCount += (i[field])? 1 : 0;     
        }
        let percentageFilled = (nonNullCount/recordCount)*100;
        outArr.push({Field: field, totalRows: recordCount, RowsWithValues: nonNullCount , percentageFilled: percentageFilled.toFixed(0) + "%"  })
    } 
 return outArr;


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