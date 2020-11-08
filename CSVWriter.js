//To Create a CSV
let headersStr = getCSVstring_PropNamesAsHeaders(initialObject,",");
//Check props for delimiter and replace with something else 
let cleanData = regexReplaceinProps(initialObject, /,/g, " ")
let recordsStr = ConvertToCSV(cleanData, ",");
writeCSV(headersStr + recordsStr , "MyFeed");

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