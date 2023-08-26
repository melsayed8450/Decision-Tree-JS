window.addEventListener('DOMContentLoaded', init);


function init() {
    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", start);
}

function start() {
    const jsonInput = document.getElementById("jsonInput");
    try{
        const json = JSON.parse(jsonInput.value);
        if(isValidDecisionTree(json)){
            localStorage.setItem('json', jsonInput.value);
        window.location.href = "home.html";
        }else{
            warn('Plaese enter a valid decision tree json');
        }
    }catch(_){
        warn('Plaese enter a valid json');
    }
   
    function warn(message) {
        alert (message);
      }
    
}

function isValidDecisionTree(node) {
    if (typeof node !== 'object' || node === null) {
      return false;
    }
  
    if ('answer' in node) {
      return Object.keys(node).length === 1; // Only "answer" key is allowed in leaf nodes.
    }
  
    if ('question' in node && ('yes' in node || 'no' in node)) {
      const hasYes = 'yes' in node && isValidDecisionTree(node.yes);
      const hasNo = 'no' in node && isValidDecisionTree(node.no);
      return hasYes && hasNo;
    }
  
    return false;
  }