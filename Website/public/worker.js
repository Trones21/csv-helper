
onmessage = function (e) {
    console.log(e)
    let t = e.data;
    //console.log(t.workerId)
    var fr = new FileReader();
    var slice = t.file.slice(t.startIndex, t.startIndex + t.CHUNK_SIZE);
    let processChunkBoundArgs = processChunk.bind({ slice: slice, workerId: t.workerId });

    fr.onload = processChunkBoundArgs;
    fr.readAsText(slice);
}

function finished(startTime) {
    let endTime = Date.now();
    console.log(startTime)
    console.log((endTime - startTime) / 1000 + " seconds")
}


function processChunk(slice, workerId) {
    let text = slice.target.result;
    //let res = mainParse(text, workerId)

    console.log("str len: " + text.length);
    const prem = "pre" + workerId;
    const postm = "post" + workerId;
    performance.mark(prem);
    let res = simpleMoveInward(text, workerId);
    let flatObjs = []
    for (let obj of res) {
        flatObjs.push(flatten(obj))
    }
    let props = [];
    for (let obj of flatObjs) {
        let objProps = Object.getOwnPropertyNames(obj)
        for (let i of objProps) {
            if (!props.includes(i)) {
                props.push(i);
            }
        }
    }
    performance.mark(postm);
    performance.measure("sim", prem, postm);
    console.log(performance.getEntriesByType("measure"));
    console.log("Processed chunk")
    postMessage({ msgType: "streamWriter", props: props, objs: flatObjs, workerId: this.workerId });
}

//753 - 1838ms
function simpleMoveInward(text, workerId) {
    let firstBracket = text.indexOf('{');
    let lastBracket = text.lastIndexOf('}');

    try {
        let out = JSON.parse('[' + text.slice(firstBracket, lastBracket + 1) + ']')
        console.log("Success Parse")
        return out;
    } catch {
        console.log({ FP: "FailParse" })
        //console.log(text.slice(firstBracket, lastBracket + 1))
        return "";
    }

}

//This is just WAAAY too SLOW. I should use simpleMoveInward instead.
/** @description Parsing metho */
function mainParse(str, workerId) {
    const s1 = "a";
    const s2 = "b";
    const s3 = "c";
    const s4 = "d";
    const s5 = "e";
    const s6 = "f";
    const s7 = "g";
    //Replace \"
    let t2 = str;
    t2 = t2.replace(/\\"/g, '');
    performance.mark(s1);
    let potentialCtrlChars = [...t2.matchAll(/"|{|}|\[|\]/g)];
    performance.mark(s2);
    let quoteIndices = potentialCtrlChars.filter(i => i[0] === '"').map(i => i.index);
    let checkChars = potentialCtrlChars.filter(i => i[0] !== '"')

    performance.mark(s3);

    //let controlChars = alt3to4(checkChars, quoteIndices)
    let controlChars = main3to4(t2, checkChars, quoteIndices)

    performance.mark(s4);
    //Maybe I can turn this into a reduce or some other function
    //Assign depth to Each controlChar
    let currDepth = 0;
    let withDepth = []
    for (let char of controlChars) {
        //console.log(char)
        switch (char[0]) {
            case "{":
                currDepth += 1;
                break;
            case "}":
                currDepth -= 1
                break;
            default:
        }
        withDepth.push({
            char: char[0],
            index: char.index,
            depth: currDepth
        })
    }
    performance.mark(s5);
    //Get minDepth to determine the top level objects
    let min = withDepth.map(i => i.depth).reduce((i, j) => {
        let m = (i < j) ? i : j;
        return m;
    }
    )

    //Cleanup Ends - These need to be joined with other file parts and parsed 
    let preObjEndPos = withDepth.filter(i => {
        return i.depth === min
    }
    )[0].index;

    let UnparsedCharsAtBeginning = t2.substring(0, preObjEndPos);
    let endParsePos = withDepth.filter(i => {
        return i.depth === min
    }
    ).pop().index + 1;

    let endPart = t2.substring(endParsePos)
    let UnparsedCharsAtEnd = "";
    if (endPart.indexOf('{') === -1) {
        console.log("No More Chars");
    } else {
        UnparsedCharsAtEnd = endPart.substring(endPart.indexOf('{'));
    }

    performance.mark(s6);
    //Parse Full Objects
    let startParsePos = withDepth.filter(i => {
        return i.index > preObjEndPos
    }
    )[0].index;
    performance.mark(s7);
    performance.measure("s1 to s2", s1, s2);
    performance.measure("s2 to s3", s2, s3);
    performance.measure("s3 to s4", s3, s4);
    performance.measure("s4 to s5", s4, s5);
    performance.measure("s5 to s6", s5, s6);
    performance.measure("s6 to s7", s6, s7);
    console.log(performance.getEntriesByType("measure"));

    //let outObjs = t2.substring(startParsePos, endParsePos)
    let outObjs = JSON.parse("[" + t2.substring(startParsePos, endParsePos) + "]");
    console.log(outObjs);
    return { Parsed: outObjs, preText: UnparsedCharsAtBeginning, postText: UnparsedCharsAtEnd };
}

function getNextQuoteIndex(startIndex, quoteIndicesP) {
    let largerNums = quoteIndicesP.filter(i => i > startIndex)
    if (largerNums.length === 0) {
        //There are no more quotes in the text
        return -1;
    } else {
        var min = largerNums[0];
        for (let i = 1; i < largerNums.length; i++) {
            let val = largerNums[i];
            min = (val < min) ? val : min;
        }
        return min;
    }

}

function isControlChar(text, Pattern) {
    //if there are characters other than whitespace, colon, comma, curly brackets or array braces
    //then it's part of the string (and not a controlChar) 
    let badChars = [...text.matchAll(Pattern)];
    if (badChars.length > 0) {
        return false;
    }

    return true;
}

function main3to4(fulltext, checkChars, quoteIndices) {
    let controlChars = [];
    console.log(checkChars.length);
    const Pattern = /[^{}\s,\[\]:]/gm
    //Check for certain characters between potentialCtrlChar and next dbl quote - see isControlChar for implementation details
    for (let c of checkChars) {
        let quoteIdx = getNextQuoteIndex(c.index, quoteIndices)
        if (quoteIdx === -1) {
            //No more quotes, but it may be a closing bracket }
            if (c[0] === '}') {
                controlChars.push(c);
            }
        } else {
            if (isControlChar(fulltext.slice(c.index, quoteIdx), Pattern)) {
                controlChars.push(c);
            }
        }
    }
    return controlChars;
}

function alt3to4(checkChars, quoteIndices) {
    let x = checkChars.map((i, idx) => {

    })


}
/**@description Flatten the JSON */
function flatten(data) {
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










/*OLD CODE Might be able to reuse for non-nested input files --- */

function check4Objects(string) {

    //Remove the [ on the first chunk
    let checkStr = "";
    if (string.indexOf("[") !== -1 && (string.indexOf("[") < string.indexOf("{"))) {
        checkStr = string.substring(string.indexOf("[") + 1, string.length)
    } else {
        checkStr = string;
    }

    //Try Progressively smaller strings until parsed or nothing is left 
    let tryShorter = true;
    let json = "";
    while (tryShorter === true) {
        try {
            checkStr = checkStr.substring(0, checkStr.lastIndexOf("}") + 1);
            json = JSON.parse("[" + checkStr + "]")
            tryShorter = false
        } catch (err) {
            if (checkStr.lastIndexOf("}") === -1) {
                //No more } , stop while loop, can't parse
                tryShorter = false
                //console.log("No more parsing (On this while loop/chunk)")
            }
            checkStr = checkStr.substring(0, checkStr.length - 2)
        }
    }

    //The last object is not parsed because it is only partially in memory.
    //Therefore, we need to tell our filereader how far back the start of this object is 
    let unParsedPart = string.slice(checkStr.lastIndexOf("}"), string.length);
    unParsedPart = unParsedPart.slice(unParsedPart.indexOf("{"), unParsedPart.length);
    checkStr = unleakString(checkStr);

    return { json: json, unParsedLen: unParsedPart.length };

}


