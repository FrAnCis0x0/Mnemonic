"use strict"
import { Practice } from './js/cypher.js';

//Mnemonic Practising Site

let gameType = '';
checkLocalStorageData();


const buttons = document.querySelectorAll('.btn');
const para = document.querySelectorAll('p');

const display1 = document.getElementById("display");

const practise = new Practice(gameType);
let lock = false;
let timeout;
var keycode = "";
let req=0;
let isThreeDigit = false;





buttons.forEach((button) => {
  button.addEventListener('click', debounce((event) => {
    if(practise.compareMouseSelection(Number(button.innerText)) && gameType == "number"){
      practise.randomWordGenerator()
      modeOne.run()
      req=0;
    }else if(practise.compareMouseSelection(button.innerText) && gameType == "word"){
      practise.randomWordGenerator()
      modeOne.run()
      req=0;
    }else{
      if(gameType == "number" && req == 5){
        keycode = "1337";
        checkLocalStorageData()
        keycode=""
      }else if(gameType == "word" && req == 5){
        keycode = "7331";
        checkLocalStorageData()
        keycode=""
      }else{
        req++;
      }
      
    }
  },100));
});
window.addEventListener("keyup",(e)=>{
  myFunction(e);
});
function myFunction(event) {
  if(!isNaN(event.key)){
    keycode += String(event.key);

  }if(event.key == "Enter"){
    checkLocalStorageData();
    modeOne.run();

    keycode = '';

  }

}

function debounce(func, wait) {
  
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  }
}

//OBJECT STARTS HERE
let modeOne = {
  currentWord:"",
  numberToAvoid:[],
  generateWord:function(){ 
    this.currentWord = practise.getCurrentWord();
    if(practise.checkCurrentNumber() >= 100){
      isThreeDigit = true;
    }
    this.getValue(practise.getCurrentNumber(isThreeDigit));
    
    return this.currentWord;
  },
  asignNewValues:function(){
    let btnNumber=0;
    
    para.forEach((button) => {
     
      if(practise.gameType=="word"){
        button.innerHTML = practise.getNumberItem(this.numberToAvoid[btnNumber], isThreeDigit);
        
      }else{
        if(isThreeDigit){
          button.innerHTML = practise.getWordItem(this.numberToAvoid[btnNumber], isThreeDigit);

        }else{
        button.innerHTML = this.numberToAvoid[btnNumber];
        }
      }
      btnNumber++;
    });
  },
  sliceNumber:function(threeDigitNumber){
    let digitToString = String(threeDigitNumber).split('');
    return digitToString.at(-1);
  
  },

  getValue: function(givenNumber){
    if(givenNumber >= 100){
      isThreeDigit = true;
      givenNumber = Number.parseInt(this.sliceNumber(givenNumber))
    }

    //Todo generate button values
    let max = (givenNumber < 99 && givenNumber <= 94)? givenNumber+5 : givenNumber;
    let min = (givenNumber <= 5 )? givenNumber : givenNumber-5;

    
    



   let intervalId = setInterval(() => {
      if(this.numberToAvoid.length === 2 && !this.numberToAvoid.includes(givenNumber)){

        this.numberToAvoid.push(givenNumber);
       
      }
      if(this.numberToAvoid.length === 4){
        this.shuffleArray();
        this.asignNewValues();
        this.numberToAvoid.length = 0;
        isThreeDigit = false;

        clearInterval(intervalId)
      
        return;

        
      }
      let num = Math.floor(Math.random() * (max - min))+min;
      if(num >= 10 && isThreeDigit){
        num=givenNumber;
      }
      

      if (!this.numberToAvoid.includes(num)) {
        
        
          this.numberToAvoid.push(num);
        }
        

    
    },1)

  },
  
  shuffleArray:function(){
      for (let i = this.numberToAvoid.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.numberToAvoid[i], this.numberToAvoid[j]] = [this.numberToAvoid[j], this.numberToAvoid[i]];
      }
  },
 
  run: function(){
      if (lock) {
        return;  // exit the function if the lock is set
      }
      lock = true;
      this.generateWord();
      display1.innerText = (practise.gameType == "number") ? practise.getCurrentWord() : String(practise.getCurrentNumber()).slice(-2);

      
      lock = false;
  }



};


function checkLocalStorageData() {
  const data = localStorage.getItem('mind');
  if (!data) {
    const newData = {"gameType":"number"};
    localStorage.setItem('mind', JSON.stringify(newData));
  } else {
    // data exists, do something with it
    if(keycode=="1337" && JSON.parse(data).gameType == "number"){
      localStorage.setItem('mind', JSON.stringify({"gameType":"word"}));
      location.reload(); 

    }else if(keycode=="7331" && JSON.parse(data).gameType == "word"){
      localStorage.setItem('mind', JSON.stringify({"gameType":"number"}));
      location.reload(); 

    }
    
  }
  gameType = String(JSON.parse(localStorage.getItem('mind')).gameType);
}
modeOne.run();


