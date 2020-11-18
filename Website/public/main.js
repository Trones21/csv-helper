import {convert, cleanUpModal} from './jsontocsv.mjs';
import analyze from './CSVAnalyzer.mjs';

var switchUI= function(){
    console.log("switchUi called")
    let choice = this.toString();
    switch(choice){
        case "JSONtoCSV":
            document.querySelector('.uiJSONtoCSV').setAttribute('style', '')
            document.querySelector('.uiCSVAnalyzer').setAttribute('style', 'display:none')
        break;
        case "CSVAnalyzer":
            document.querySelector('.uiJSONtoCSV').setAttribute('style', 'display:none')
            document.querySelector('.uiCSVAnalyzer').setAttribute('style', '')
        break;
        default:
            console.log("Bad parameter sent to switchUI func");
        break;
    }
 }

let analyzeL = function(){
    console.log("loadsadsad")
}

 let buttons = document.querySelector('.UISelectButtons').children;
 buttons[0].addEventListener('click', switchUI.bind("JSONtoCSV"), false)
 buttons[1].addEventListener('click', switchUI.bind("CSVAnalyzer"), false)

//JSON to CSV Converter Listeners
let converterUploadbtn = document.getElementsByClassName('converterUploadbtn')[0];
converterUploadbtn.addEventListener('click', convert, false);

let converterModalClosebtn = document.getElementsByClassName('converterModalClose')[0];
converterModalClosebtn.addEventListener('click', cleanUpModal, false);

//CSV Analyzer Listeners
let analyzerUploadbtn = document.getElementsByClassName('analyzerUploadbtn')[0];
analyzerUploadbtn.addEventListener('click', analyze, false);

let analyzerModalClosebtn = document.getElementsByClassName('analyzerModalClose')[0];
analyzerModalClosebtn.addEventListener('click', () => {console.log("to Implement")}, false);

