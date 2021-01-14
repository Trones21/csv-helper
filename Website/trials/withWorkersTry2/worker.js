let waitForWriteTurnResolve = () => { }
let workerId;
onmessage = function (e) {
    switch (e.data.msgType) {
        case "processData":
            processData(e)
            break;
        case "whoseTurnRes":
            let whoseTurn = e.data.whoseTurn;
            console.log(e)
            waitForWriteTurnResolve(whoseTurn);
            break;

    }
}

async function processData(e) {
    workerId = e.data.workerId;
    let processedData = "Processed data from Web Worker num " + workerId + " \r\n";
    
    //Simulate workers finishing out of order
    await sleep(Math.random() * 500);
    
    let whoseTurn = await waitForTurn();
    while (whoseTurn !== workerId){
        await new Promise(r => setTimeout(r, 1000))
        console.log("Its " + whoseTurn + " turn, but I am " + workerId)
        whoseTurn = await waitForTurn();
        
    }
    console.log("My Turn: " + workerId);
    postMessage({msgType:'write', workerId:workerId, text: processedData})

}

async function waitForTurn() {
    return new Promise((resolve, reject) => {
        waitForWriteTurnResolve = resolve;
        postMessage({msgType: "whoseTurn", workerId:workerId })

    });
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}