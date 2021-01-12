//We don't need such complex processing if the objects are uniform
//Id 105 is the first top level object, but there is no way to know that until reading all the text. 
//We cannot assume "revenue" is a full object even though it can be parsed

//Remember that slashes need to be escaped in the template string, or use String.raw!!! 
let t1 = String.raw`unt": 0
},
    {
    "revenue": "$1 to $2 billion (USD)",
    "website": null,
    "headquarters": "Boston, MA",
    }
},
{
"id": 105,
"name": "AbiibiBowater Inc.",
"ceo": 
    {
    "name": "Richard Garneau",
    "dateStarted": "2011-04-06T22:16:44.420"
    },
"primaryIndustry": 
    {
    "industryName": "Industrial Manufacturing",
    "sectorName": "Manufacturing"
    },
"headquarters": "Boston"
} ,
{
"asd": "aasdsadsd"
},
{
"bbb": "bbbb"
} 
`


export function mainParse(str) {
    //Replace \"
    let t2 = str;
    t2 = t2.replace(/\\"/g, '');

    let potentialCtrlChars = [...t2.matchAll(/"|{|}|\[|\]/g)];

    let quoteIndices = potentialCtrlChars.filter(i => i[0] === '"').map(i => i.index);
    let checkChars = potentialCtrlChars.filter(i => i[0] !== '"')

    let controlChars = [];

    //Check for certain characters between potentialCtrlChar and next dbl quote - see isControlChar for implementation details
    for (let c of checkChars) {
        let quoteIdx = getNextQuoteIndex(c.index, quoteIndices)
        console.log(c);
        if (quoteIdx === -1) {
            //No more quotes, but it may be a closing bracket }
            if (c[0] === '}') {
                controlChars.push(c);
            }
        } else {
            if (isControlChar(t2.slice(c.index, quoteIdx))) {
                controlChars.push(c);
            }
        }
    }

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


    //Parse Full Objects
    let startParsePos = withDepth.filter(i => {
        return i.index > preObjEndPos
    }
    )[0].index;


    //let outObjs = t2.substring(startParsePos, endParsePos)
    let outObjs = JSON.parse("[" + t2.substring(startParsePos, endParsePos) + "]");
    console.log(outObjs);
    return {Parsed: outObjs, preText: UnparsedCharsAtBeginning, postText:UnparsedCharsAtEnd};

    function getNextQuoteIndex(startIndex, quoteIndices) {
        let largerNums = quoteIndices.filter(i => i > startIndex)
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

    function isControlChar(text) {
        //if there are characters other than whitespace, colon, comma, curly brackets or array braces
        //then it's part of the string (and not a controlChar) 
        let badChars = [...text.matchAll(/[^{}\s,\[\]:]/gm)];
        if (badChars.length > 0) {
            return false;
        }

        return true;
    }
}
