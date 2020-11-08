/* CSV creation/conversion Example */
let headersStr = getCSVstring_PropNamesAsHeaders(initialObject, ",");
//Check props for delimiter and replace with something else 
let cleanData = regexReplaceinProps(initialObject, /,/g, " ")
let recordsStr = ConvertToCSV(cleanData, ",");
writeCSV(headersStr + recordsStr, "MyCSVFile");


/* Actual Functions */
function ConvertToCSV(objArray, delimiter) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    //Store some variables on outer loop for Performance
    let masterObjKeyStr = Object.keys(array[0]).toString();
    let masterObjPropCount = Object.keys(array[0]).length;
   
    //Iterate through Object Array 
    for (var i = 0; i < array.length; i++) {

        //Compare Properties 
        if (masterObjKeyStr === Object.keys(array[i]).toString()) {
            str += toCSVString(array[i], delimiter);
        } else {

            //Missing and/or Out of Order Properties
            if (Object.keys(array[i]).length <= masterObjPropCount) {
                let fixedObj = PropsMissingAndOrWrongOrder(array[0], array[i]);
                str += toCSVString(fixedObj, delimiter)
                console.log("Line " + i + " Missing and/or out of Order Properties. Adding Nulls/Resorting")
            }
        }
        //If there are Extra Properties, just ignore these lines for now
        if (Object.keys(array[i]).length > masterObjPropCount) {
            console.log("Line " + i + " Has Extra Properties. NOT WRITING TO CSV")
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
            }
        }

        //Property wasn't found, so we must add a null key 
        if (found === false) {

            fixedObj[FindKey] = "BLAH";
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


function getCSVstring_PropNamesAsHeaders(objArray, delimiter) {
    let headersObj = {};
    headersObj.str = "";
    for (let field in objArray[0]) {
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