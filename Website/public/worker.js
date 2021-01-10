import {main} from './parser'

onmessage = function(e){
    //console.log(e)
   let t = e.data;
   //console.log(t.workerId)
   var fr = new FileReader();
   var slice = t.file.slice(t.startIndex, t.startIndex + t.CHUNK_SIZE);
   let processChunkBoundArgs = processChunk.bind({slice:slice, workerId: t.workerId});
   
   fr.onload = processChunkBoundArgs;
   fr.readAsText(slice);
}

function finished(startTime){
    let endTime = Date.now();
    console.log(startTime)
    console.log((endTime - startTime)/1000 + " seconds" )
 }


function processChunk(slice, workerId) {
    let text = slice.target.result;
    postMessage({text:text, workerId:this.workerId});
    }












/*OLD CODE Might be able to reuse for non-nested input files --- */

function check4Objects(string){

//Remove the [ on the first chunk
let checkStr = "";
if(string.indexOf("[") !== -1 && (string.indexOf("[") < string.indexOf("{"))){
    checkStr = string.substring(string.indexOf("[") + 1, string.length)
} else{
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
        if(checkStr.lastIndexOf("}") === -1){
            //No more } , stop while loop, can't parse
            tryShorter = false
            console.log("No more parsing (On this while loop/chunk)")
        }
        checkStr = checkStr.substring(0, checkStr.length - 2)
    }
}

//The last object is not parsed because it is only partially in memory.
//Therefore, we need to tell our filereader how far back the start of this object is 
let unParsedPart = string.slice(checkStr.lastIndexOf("}") , string.length);
unParsedPart = unParsedPart.slice(unParsedPart.indexOf("{"), unParsedPart.length);
checkStr = unleakString(checkStr);

return {json:json, unParsedLen: unParsedPart.length};

}


