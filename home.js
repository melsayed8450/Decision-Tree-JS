
const canvas = document.getElementById('tree-canvas');
const animationCanvas = document.getElementById('animation-canvas');
const startButtom = document.getElementById('start-button');
const container = document.getElementById('container');
const ctx = canvas.getContext('2d');
const animationCtx = animationCanvas.getContext('2d');
const nodeRadius = 50;
const levelHeight = 200;
const xOffset = canvas.width / 2;
const nodePositions = {};
const questions = [];
window.addEventListener('DOMContentLoaded', init);

const circle = {
  x: 0,
  y: 0,
  radius: 50,
  targetX: animationCanvas.width * 0.7,
  targetY: animationCanvas.height/2,
  speed: 2
};

function init() {
  const tree = localStorage.getItem('json');
  const rootNode = JSON.parse(tree);
  const canvasSize = calculateCanvasSize(rootNode);
  
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;
  animationCanvas.width = canvasSize.width;
  animationCanvas.height = canvasSize.height;
  drawTree(rootNode, canvas.width / 2, 300, 1);
  addingQuestions();
  startButtom.addEventListener('click', () => {
    animationCtx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
  drawAnswers(rootNode);
  });
}

function drawTree(node, x, y, level) {
  ctx.beginPath();
  ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
  ctx.fillStyle = node.question ? 'blue' : 'green';
  ctx.fill();
  ctx.stroke();

  ctx.font = '12px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(node.question || node.answer, x, y);
  if(node.question){
    questions.push(node.question);
  }

  nodePositions[node.question || node.answer] = { x, y };

  if (node.yes) {
    const yesX = x + canvas.width / Math.pow(2, level + 1);
    const yesY = y + levelHeight;
    ctx.beginPath();
    ctx.moveTo(x, y + nodeRadius);
    ctx.lineTo(yesX, yesY - nodeRadius);
    ctx.stroke();
    drawTree(node.yes, yesX, yesY, level + 1);
  }

  if (node.no) {
    const noX = x - canvas.width / Math.pow(2, level + 1);
    const noY = y + levelHeight;
    ctx.beginPath();
    ctx.moveTo(x, y + nodeRadius);
    ctx.lineTo(noX, noY - nodeRadius);
    ctx.stroke();
    drawTree(node.no, noX, noY, level + 1);
  }
}
function calculateCanvasSize(node) {
  const levels = getTreeLevels(node);
  const maxWidth = Math.pow(2, levels) * (nodeRadius * 2);
  const maxHeight = levels * levelHeight + nodeRadius * 4;
  return { width: maxWidth, height: maxHeight };
}

function getTreeLevels(node) {
  if (!node) {
    return 0;
  }
  return 1 + Math.max(getTreeLevels(node.yes), getTreeLevels(node.no));
}

function addingQuestions(){
  for(var i = 0; i < questions.length; i++) {
    const horizontalContainer = document.createElement('div');
    horizontalContainer.classList.add('horizontal-container');
    const text = document.createTextNode(questions[i]);
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = questions[i];
    horizontalContainer.appendChild(text);
    horizontalContainer.appendChild(checkBox);
    container.appendChild(horizontalContainer);
  }
}


animationCanvas.width = window.innerWidth;
animationCanvas.height = window.innerHeight;

function drawCircle(x, y, radius) {
  animationCtx.beginPath();
  animationCtx.arc(x, y, radius, 0, Math.PI * 2);
  animationCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  animationCtx.fill();
  animationCtx.closePath();
}

function drawAnswers(node){

  if(node.answer){
    circle.x = nodePositions[node.answer].x;
     circle.y = nodePositions[node.answer].y;
    drawCircle(circle.x, circle.y, nodeRadius);
  return;
  };

const isQuestionChecked = document.getElementById(node.question).checked;

if(isQuestionChecked){
  circle.x = nodePositions[node.question].x;
  circle.y = nodePositions[node.question].y;
  drawCircle(circle.x, circle.y, nodeRadius);
  drawAnswers(node.yes);
}else{
  circle.x = nodePositions[node.question].x;
  circle.y = nodePositions[node.question].y;
  
  drawCircle(circle.x, circle.y, nodeRadius);
  drawAnswers(node.no);
}
}

//  function animate() {
//   return new Promise(resolve => {
    
//   const dx = circle.targetX - circle.x;
//   const dy = circle.targetY - circle.y;
//   const distance = Math.sqrt(dx * dx + dy * dy);
//   function animationLoop() {
//     animationCtx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
//   if (distance > circle.speed) {

//     circle.x += (dx / distance) * circle.speed;
//     circle.y += (dy / distance) * circle.speed;
//   } else {

//     circle.x = circle.targetX;
//     circle.y = circle.targetY;
    
//     // return;
//   }

//   drawCircle(circle.x, circle.y, nodeRadius, 'rgba(255, 0, 0, 0.5)');

//   requestAnimationFrame(animate);
//   resolve(); 
//   // return;
//   }
//   animationLoop();
  
//   });
  
// }


// async function animateAnswers(node){
//   if(node.answer) return;

//   const isQuestionChecked = document.getElementById(node.question).checked;

//   if(isQuestionChecked){
//     circle.x = nodePositions[node.question].x;
//     circle.y = nodePositions[node.question].y;
//     circle.targetX = nodePositions[node.yes.question || node.yes.answer].x;
//     circle.targetY = nodePositions[node.yes.question || node.yes.answer].y;
    
//     await animate();
//     console.log(isQuestionChecked);
//     animateAnswers(node.yes);
//   }else{
//     circle.x = nodePositions[node.question].x;
//     circle.y = nodePositions[node.question].y;
//     circle.targetX = nodePositions[node.no.question || node.no.answer].x;
//     circle.targetY = nodePositions[node.no.question || node.no.answer].y;
    
//     await animate();
//     console.log(isQuestionChecked);
//      animateAnswers(node.no);
//   }
// }


// {
//   "question": "Is it a mammal?",
//   "yes": {
//     "question": "Does it have fur?",
//     "yes": {
//       "question": "Is it a domestic animal?",
//       "yes": {
//         "answer": "It's a cat."
//       },
//       "no": {
//         "answer": "It's a bear."
//       }
//     },
//     "no": {
//       "answer": "It's a reptile."
//     }
//   },
//   "no": {
//     "question": "Does it have wings?",
//     "yes": {
//       "answer": "It's a bird."
//     },
//     "no": {
//       "question": "Is it an insect?",
//       "yes": {
//         "answer": "It's a bee."
//       },
//       "no": {
//         "answer": "It's a fish."
//       }
//     }
//   }
// }

