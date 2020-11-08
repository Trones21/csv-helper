function getCompletionRates(objArray){
    //Assumes all objects have the same properties
    //Count Properties
    let outArr = [];
    for(let k in objArray[0]){
        let field = k;
        let nonNullCount = 0;
        let recordCount = 0;
        for(let i of objArray){
           recordCount += 1;
           nonNullCount += (i[field])? 1 : 0;     
        }
        let percentageFilled = (nonNullCount/recordCount)*100;
        outArr.push({Field: field, totalRows: recordCount, RowsWithValues: nonNullCount , percentageFilled: percentageFilled.toFixed(0) + "%"  })
    } 
 return outArr;


}