let addTipsBtn = document.getElementById('addTipsBtn');
let TipsList = document.querySelector('.TipsList');
let TipsDiv = document.querySelectorAll('.TipDiv')[0];

addTipsBtn.addEventListener('click', function(){
  let newTips = TipDiv.cloneNode(true);
  let input = newTips.getElementsByTagName('input')[0];
  input.value = '';
  TipsList.appendChild(newTips);
}); 