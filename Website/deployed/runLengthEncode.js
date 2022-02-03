// {
//     colName: {
//         val1: [singleInt, [rangeStart, rangeEnd]] //row Index
//     }
// }


// let test = [
//     {
//         "username": "goldberg",
//         "followers": 18003
//     },
//     {
//         "username": "ivanhodl",
//         "followers": 18003,
//     },
//     {
//         "username": "ivanhodl",
//         "followers": 18003,
//     },
//     {
//         "username": "goldberg",
//         "followers": 3456,
//     }

const runLengthEncode = (objArr) => {

    let rleMap = {}

    for (let [idx, obj] of objArr.entries()) {
        for (let [key, val] of Object.entries(obj)) {
            //Add Column
            if (!rleMap.hasOwnProperty(key)) {
                rleMap[key] = {};
            }
            //Add Val
            if (!rleMap[key].hasOwnProperty(val)) {
                rleMap[key][val] = []
            }
            rleMap[key][val] = updateValIdxArr(idx, rleMap[key][val])

        }
    }

    return rleMap;
}

const updateValIdxArr = (idx, valIdxArr) => {
    //Current format [1, [8, 12], 15]
    //Could also use an object like [1, {start: 8, end: 12}, 15] Maybe a class???s

    //Check for Running & Push rowIndex
    let ptr = valIdxArr;

    //First Item
    if (ptr.length === 0) {
        ptr.push(idx)
        return ptr;
    }

    //Handle Range
    let lastItem = ptr[ptr.length - 1];
    //Start Range      
    if (lastItem === idx - 1) {
        //then this is a range... 
        ptr[ptr.length - 1] = [idx - 1, idx];
        return ptr;
    }

    if (Array.isArray(lastItem)) {
        //Continue Range
        if (lastItem[1] === idx - 1) {
            ptr[ptr.length - 1][1] = idx;
        } else {
            //End Range - Push to outside
            ptr.push(idx);

        }
        return ptr;
    }

    //Normal
    ptr.push(idx)
    return ptr;
}