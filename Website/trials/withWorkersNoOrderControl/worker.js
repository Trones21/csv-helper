
onmessage = function (e) {

 processData(e)
}

async function processData(e){
     
    let processedData = "Processed data from Web Worker num " +  e.data.workerId + " \r\n";
    
    //Simulate workers finishing out of order
    await sleep(Math.random()*500);
    
    postMessage({text: processedData})

}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }