
class Columns{
    constructor(){
        this.columns = [];
    }
}

class Column{
    constructor(FieldName){
        this.fieldName = FieldName;
        this.nullEmptyCount = 0;
        this.distinctValues = [];
    }
}

onmessage = function(file){
    let CSVStats = [];
    //Create propStat for each field
    var fr = new FileReader();
    console.log(file);
    let wAnalyze = analyze.bind({d:file.data})
    fr.onload = wAnalyze;
    fr.readAsText(file.data);
}

function analyze(data){
 let CSVStr = data.target.result;
 simple(CSVStr);
 
 
}

function simple(CSVString){
   let objArr = CSVStringtoObjArr(CSVString, ",");
   console.log(objArr)
   let compRates = getCompletionRates(objArr);
   let distinctValCount = getDistinctValCount(objArr)
   console.log(distinctValCount)
}

function CSVStringtoObjArr(CSVString, delimiter){
    let arr = CSVString.split('\n')
    var jsonObj = [];
    var headers = arr[0].split(delimiter);
    for(var i = 1; i < arr.length; i++) {
      var data = arr[i].split(delimiter);
      var obj = {};
      for(var j = 0; j < data.length; j++) {
         obj[headers[j].trim()] = data[j].trim();
      }
      jsonObj.push(obj);
    }
    return jsonObj;
}

function getDistinctValCount(objArray){

}

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

function OOStyle(string){
    //Work In Progress
    let headers = Array.from(CSVString.split(/\n/g)[0])
    let columns = new Columns();
    for(let header of headers){
        let col = new Column(header);
        columns.push(col);
    }
    let rows = Array.from(CSVString.split(/\n/g)[0])
}

