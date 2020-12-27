//We don't need such complex processing if the objects are uniform
//Id 105 is the first top level object, but there is no way to know that until reading all the text. 
//We cannot assume "revenue" is a full object even though it can be parsed

//Remember that slashes need to be escaped in the template string, or use String.raw!!! 
let t2 = String.raw`unt": 0
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
"ceo": {

    "name": "Richard Garneau",
    "dateStarted": "2011-04-06T22:16:44.420"
},
"primaryIndustry": {
    "industryName": "Industrial Manufacturing",
    "sectorName": "Manufactu\"  sfsdf \"ring"
},
"headquarters": "Boston,
},
{ 
"asd": "asd"
},
{"nextob`



//Replace \"
t2 = t2.replace(/\\"/g, '');

let potentialCtrlChars = [...t2.matchAll(/"|{|}|\[|\]/g)];

let quoteIndices = potentialCtrlChars.filter(i=>  i[0] === '"').map(i => i.index);
let checkChars = potentialCtrlChars.filter(i=>  i[0] !== '"')

let controlChars = [];

//Check for certain characters between potentialCtrlChar and next dbl quote - see isControlChar for implementation details
for(let c of checkChars){
let quoteIdx = getNextQuoteIndex(c.index, quoteIndices)
if(quoteIdx === -1){
  //No more quotes, maxDepth will not change, so in this case
  //we don't need to determine if it is a controlChar
  //console.log("not checking char")  
}else{
if(isControlChar(t2.slice(c.index, quoteIdx))){
    controlChars.push(c);
}
}       
}


console.log(controlChars);

//Maybe I can turn this into a reduce or some other function
//Assign depth to Each controlChar
let currDepth = 0;
let withDepth = []
for (let char of controlChars){
console.log(char)
switch(char[0]){
case "{": currDepth += 1;
break;
case "}": currDepth -= 1 
break;
default:
}
withDepth.push({char: char[0], index: char.index, depth: currDepth})
}
console.log(withDepth)

//Get minDepth to determine the top level objects
let min = withDepth.map(i => i.depth).reduce((i, j) =>{return min = (i < j)? i:j;} )

for (let char in withDepth){
if(min === char.depth){
//This is the close of a top level object,
//Next object is top level
}
}


function getNextQuoteIndex(startIndex, quoteIndices){
let largerNums = quoteIndices.filter(i => i > startIndex)
if(largerNums.length === 0){
//There are no more quotes in the text
return -1;
} else {
let min = largerNums[0];
for(let i = 1; i < largerNums.length; i++){
   let val = largerNums[i];
   min = (val < min) ? val : min; 
}
return min;
}

}


function isControlChar(text){
//if there are characters other than whitespace, colon, comma, curly brackets or array braces
//then it's part of the string (and not a controlChar) 
let badChars = [...text.matchAll(/[^{}\s,\[\]:]/gm)];
 if(badChars.length > 0){
    return false;
 }

return true;
}
