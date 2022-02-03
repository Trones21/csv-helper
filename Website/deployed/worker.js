onmessage = function (e) {
    let delimiter = e.data.delimiter;
    let windowfuncs = e.data.windowfuncs;
    let reader = new FileReader();
    reader.onload = function (f) {
        console.log('Convert')
        const prem = "pre";
        const postm = "post";
        performance.mark(prem);
        postMessage({ msgType: "stepList", stepClassName: "loadFileStatus" });

        try {
            //JSON.parse overwrites duplicates - would need a diff solution for this.
            //https://stackoverflow.com/questions/30842675/how-to-get-the-json-with-duplicate-keys-completely-in-javascript
            let data = JSON.parse(f.target.result)
            postMessage({ msgType: "stepList", stepClassName: "parseFileStatus" });

            let initialArray = data.map((i) => JSON.flatten(i))
            postMessage({ msgType: "stepList", stepClassName: "flattenArrayStatus" });

            //Clean Data
            let cleanedData = cleanData(initialArray, delimiter, e.data.keyReplace, e.data.valReplace);

            //Memory cleanup
            data = {}
            initialArray = [];

            //Prep - I have non-uniform objects so I need to create a masterObject to ensure my columns line up
            let masterObj = determineMasterObject(cleanedData)
            let headersStr = getCSVstring_PropNamesAsHeaders(masterObj, delimiter);

            //Convert & Write
            let recordsStr = ConvertToCSV(cleanedData, masterObj, delimiter);
            postMessage({ msgType: "outputData", headersStr: headersStr, recordsStr: recordsStr })

            performance.mark(postm);
            performance.measure("convert", prem, postm);
            let perf = performance.getEntriesByType("measure")

            self.importScripts('testingHelpers.js');
            self.importScripts('runLengthEncode.js');
            let rledData = runLengthEncode(cleanedData);
            let metrics = gatherMetrics(memorySizeOf, perf, cleanedData, rledData)
            console.log(metrics);
            //sendMetrics()

        } catch (err) {
            postMessage({ msgType: "error", err: err })
        }
    }

    reader.readAsText(e.data.fileList[0]);
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
        if (((i / array.length) * 100) % 10 === 0) {
            let pctDone = ((i / array.length) * 100)
            postMessage({ msgType: "progBar", params: { msg: "Converting: " + pctDone + "%", pctDone: pctDone } })

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

function cleanData(objArr, expression, keyReplace, valReplace) {
    let regex = new RegExp(`${expression}`, "g")
    for (let obj of objArr) {
        for (let [key, val] of Object.entries(obj)) {
            //Replace Delimiters in Keys
            if (key.match(regex) !== null) {
                let keyNameClean = key.replaceAll(regex, keyReplace);
                obj[keyNameClean] = val.toString().replaceAll(regex, valReplace);
                delete obj[key];
            } else {
                //...and in props
                obj[key] = val.toString().replaceAll(regex, valReplace);
            }
        }
    }
    return objArr;
}

//When the obj has the same property name at multiple levels, you need to differentiate between them
JSON.flatten = function (data) {
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
