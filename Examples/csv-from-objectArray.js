/* Example: When you have an Object Array you want to convert to CSV */

//If all objects are the same shape (and only one level),  the process is simple 
//let masterobj = data[0]       
let headersStr = getCSVstring_PropNamesAsHeaders(masterObj, ",");
let cleanData = regexReplaceinProps(initialArray, /,/g, " ")
let recordsStr = ConvertToCSV(cleanData, masterObj,",");
writeCSV(headersStr + recordsStr, "Filename");

//Otherwise you need to:
// 1. Flatten nested Objects 
// 2. Create a "Master" Object containing all properties
// 3. Sort and add missing properties (so each object looks exactly like the master object)
//Then you can continue with the normal process 

//I am not actually working on this now, just needed to grab some methods and ended up doing abit of reorganization, but maybe I'll show a full example later.
//I mean you can always write JSON and then use csv-helper.com :) 


function ConvertToCSV(objArray, masterObj, delimiter) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    //Store some variables on outer loop for Performance
    let masterObjKeyStr = Object.keys(masterObj).toString();
    let masterObjPropCount = Object.keys(masterObj).length;

    //Iterate through Object Array 
    for (var i = 0; i < array.length; i++) {

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

            fixedObj[FindKey] = null;
        }
    }

    return fixedObj;

}


function writeCSV(cleanData, fileNameNoExt) {

    let data = new Blob([cleanData], {
        type: "text/csv;charset=utf-8"
    });
    let url = window.URL.createObjectURL(data);

    let dLink = document.createElement("a");
    dLink.setAttribute("href", url);
    dLink.download = fileNameNoExt + ".csv";
    dLink.click();
}


function getCSVstring_PropNamesAsHeaders(masterObj, delimiter) {
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


//When the obj has the same property name at multiple levels, you need to differentiate between them
JSON.flatten = function(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop ? prop+"."+i : ""+i);
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}