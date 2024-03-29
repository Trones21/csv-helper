import { convert, cleanUpModal } from './jsontocsv.mjs';
import analyzerMain from './CSVAnalyzer.mjs';
//import streamSaver from './streamSaver.mjs';


//const fileStream = streamSaver.createWriteStream('filename.txt')
var switchUI = function () {
    console.log("switchUi called")
    let choice = this.toString();
    switch (choice) {
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

let analyzeL = function () {
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

let advancedOptionsToggle = document.getElementsByClassName('advancedOptionsToggle')[0];
advancedOptionsToggle.addEventListener('click', () => {
    //Show Options
    let el = document.getElementsByClassName('advancedOptions')[0];
    if (Array.from(el.classList).includes("d-none")) {
        el.className = el.className.replace(/d-none/g, '');
    } else {
        el.className = el.className.trim() + ' d-none';
    }

    //If multiple Files have been selected enable the "outputOptions" 
    // let fileNode = document.querySelector('.fileInput');
    // if (fileNode.files.length > 1) {

    //Change style of toggling element
    el = document.getElementsByClassName('advancedOptionsToggle')[0];
    if (el.style.width !== '100%') {
        el.style.width = '100%';
    } else {
        el.style.width = '60%';
    }


})




//CSV Analyzer Listeners
let analyzerUploadbtn = document.getElementsByClassName('analyzerUploadbtn')[0];
analyzerUploadbtn.addEventListener('click', analyzerMain, false);

let analyzerModalClosebtn = document.getElementsByClassName('analyzerModalClose')[0];
analyzerModalClosebtn.addEventListener('click', () => { console.log("to Implement") }, false);


