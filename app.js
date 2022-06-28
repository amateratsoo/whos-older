import API from "./API.js";


//------- set up the navigation menu -------//

const nav = document.getElementsByTagName('nav');
const navContainer = document.getElementById('nav-container');
let menuStatus = false; // it's value changes as the user click the menu

const menuIsClicked = () => menuStatus ? navContainer.style.height = `25.89rem` : navContainer.style.height = `0`;


nav['0'].onclick = () => {

  menuStatus = !menuStatus;

  menuIsClicked();

}


//------------- set up the modal ------------//


const imgs = document.getElementsByClassName('img-container');
const modal = document.getElementsByTagName('dialog');
const exitModal = document.getElementById('exit-modal');

let cardClickContext = ''; // remember this variable, 
                           // it will gonna tell us in wich card 
                           // the selected image should go


function handleModal() {

  modal['0'].showModal();
  modal['0'].style.opacity = `1`;
  modal['0'].style.marginBottom = `4rem`;

}

function hideModal() {

  modal['0'].style.marginBottom = `-4rem`;
  modal['0'].style.opacity = `0`;

}

function handleModalWhenEsc(event) {

  let keyPressed = event.key;

  if (keyPressed === 'Escape') {

    hideModal();
    setTimeout(() => modal['0'].close(), 510);

  }

}

window.addEventListener('keyup', (event) => handleModalWhenEsc(event));

imgs['0'].onclick = () => {

  handleModal();
  return cardClickContext = 'left';

}

imgs['1'].onclick = () => {

  handleModal();
  return cardClickContext = 'right';

}

exitModal.onclick = () => {

  hideModal();
  setTimeout(() => modal['0'].close(), 510);

}


//------- set modal cards dinamically -------//

const modalContent = document.getElementById('modal-content');

API.forEach((item) => {

  let card = document.createElement('div');
  card.className = 'selection-card';
  card.setAttribute('data-', `${API.indexOf(item)}`);

  
  // celebrities pictures from the API
  // as well its custom settings

  let cardImageContainer = document.createElement('div');
  cardImageContainer.className = 'card-image-container';
  card.append(cardImageContainer);


  let cardImage = document.createElement('img');
  cardImage.setAttribute('src', `${item.picture}`);
  cardImage.className = 'card-image';
  cardImageContainer.append(cardImage);

  // celebrities names from the API

  let names = document.createElement('p');
  names.className = `names`;
  names.textContent = `${item.name}`;
  card.append(names);

  modalContent.append(card);

});

let firstCardValue = false; // track the first card status to use it later
let lastCardValue = false;  // track the last card status to use it later

// store the needed user data

let firstCeleb = [];
let lastCeleb = [];

let cards = modalContent.children; // store the children to manipulate it later

for (let item of cards) {

  item.onclick = () => {

    recycleCardAnim();
    resetImgsSize();

    if (cardClickContext === 'left') {

      imgs['0'].firstElementChild.style.width = `100%`;
      imgs['0'].firstElementChild.style.height = `100%`;

      modal['0'].close();
      modal['0'].style.marginBottom = `-4rem`;
      imgs['0'].firstElementChild.src = item.firstChild.firstChild.src;

      firstCardValue = true;

      firstCeleb[0] = item.firstChild.firstChild.src;
      firstCeleb[1] = item.getAttribute('data-');

      console.log('first: ', firstCeleb);

    }

    else if (cardClickContext === 'right') {

      imgs['1'].firstElementChild.style.width = `100%`;
      imgs['1'].firstElementChild.style.height = `100%`;

      modal['0'].close();
      modal['0'].style.marginBottom = `-4rem`;
      imgs['1'].firstElementChild.src = item.firstChild.firstChild.src;

      lastCardValue = true;

      lastCeleb[0] = item.firstChild.firstChild.src;
      lastCeleb[1] = item.getAttribute('data-');

      console.log('last: ', lastCeleb);

    }

  }

}

// enable the button only if user choose two celebrities

const button = document.getElementById('next-btn');

button.onmouseover = () => {

  if (!firstCardValue || !lastCardValue) {

    button.style.cursor = `not-allowed`;
    button.onclick = () => !firstCardValue || !lastCardValue ? alert('try to choose two celebs first 😉') : null;

  }

  else if (firstCardValue && lastCardValue && firstCeleb[1] === lastCeleb[1]) {

    button.style.cursor = `not-allowed`;
    button.removeAttribute('href');
    button.onclick = () => firstCeleb[1] === lastCeleb[1] ? alert('really! they are the same person 🙄') : null;

  }

  else {
    
    button.style.cursor = `pointer`;
    button.onclick = () => toLastPageNavigation();

  }

}


// ---------- last page ----------- //

// handling the animations that
// will trigger when the window
// scrolls to this page

const resultsPage = document.getElementById('results-el');
const lastPageCards = document.getElementsByTagName('article');
const infoCardText = document.getElementsByClassName('info-card-text');


function setInfo(element, name, text, data) {

  element.textContent = `${name}'s ${text} is `;
  
  let mark = document.createElement('mark');
  mark.textContent = data;

  element.append(mark);

}


let id = firstCeleb;

function getInfo() {

  // the celeb info from the API, we retrieve these info
  // from the data atribute of the card

  let index = id[1];
  let { name, gender, nacionality, height, birthday, isAlive } = API[index];

  // bottom info card

  let ageDifference = Number(API[firstCeleb[1]].birthday[0]) - Number(API[lastCeleb[1]].birthday[0])
  lastPageCards['0'].firstElementChild.textContent = `The age difference between ${API[firstCeleb[1]].name} and ${API[Number(lastCeleb[1])].name} `;

  let br = document.createElement('br');
  lastPageCards['0'].firstElementChild.append(br);

  let span = document.createElement('span');
  span.textContent = `is ${ageDifference.toString().replace('-', '')} years old`;
  lastPageCards['0'].firstElementChild.append(span);

  // top info card

  lastPageCards[1].firstElementChild.firstElementChild.textContent = `See more info about ${name}`;

  setInfo(infoCardText['0'], name, 'gender', gender);
  setInfo(infoCardText['1'], name, 'nacionality', nacionality);
  setInfo(infoCardText['2'], name, 'height', height);
  setInfo(infoCardText['3'], name, 'birthday', birthday.toString().replace(',', ' ').replace(',', ' '));

  isAlive ? infoCardText['4'].textContent = `Currently ${name} is alive` : infoCardText['4'].textContent = `Unfortunatly ${name} is not alive`

}


// animation transition when user switches between celebs

function celebSwitch(celebId) {

  id = celebId;

  lastPageCards['1'].firstElementChild.firstElementChild.style.opacity = `0`;
  lastPageCards['1'].firstElementChild.style.width = `0%`;

  lastPageCards['1'].lastElementChild.style.maxWidth = `0%`;
  lastPageCards['1'].lastElementChild.style.minWidth = `0%`;
  
  for (let item of infoCardText) {

    item.style.opacity = `0`;

  }

  console.log(lastPageCards['1'].firstElementChild.style.width);

  setTimeout(() => {

    lastPageCards['1'].firstElementChild.style.width = `100%`;
    lastPageCards['1'].lastElementChild.style.maxWidth = `100%`;
    lastPageCards['1'].lastElementChild.style.minWidth = `100%`;

    getInfo();

    setTimeout(() => {

      lastPageCards['1'].firstElementChild.firstElementChild.style.opacity = `1`;

      for (let item of infoCardText) {

        item.style.opacity = `1`;
    
      }

    }, 607);

  }, 610);

  console.log(lastPageCards['1'].firstElementChild.style.width);

}

function bottomCardAnim() {

  setTimeout(() => {

    lastPageCards['0'].style.minWidth = `100%`;
    lastPageCards['0'].style.maxWidth = `100%`;

  }, 900);

  setTimeout(() => lastPageCards['0'].firstElementChild.style.opacity = `1`, 1500);

}

function topCardAnim() {

  setTimeout(() => lastPageCards['1'].firstElementChild.style.width = `100%`, 1900);
  setTimeout(() => lastPageCards['1'].firstElementChild.style.color = `#f5f5f5`, 2500);

}

function recycleCardAnim() {

  lastPageCards['0'].style.minWidth = `0%`;
  lastPageCards['0'].style.maxWidth = `0%`;

  lastPageCards['0'].firstElementChild.style.opacity = `0`;


  lastPageCards['1'].firstElementChild.style.width = `0%`;
  lastPageCards['1'].firstElementChild.style.color = `transparent`;

}


const finalImgs = document.getElementsByClassName('results-img-container'); // the two images containing the selected celebs

finalImgs['0'].onclick = () => {

  finalImgs['0'].lastElementChild.style.height = `114%`;
  finalImgs['0'].lastElementChild.style.width = `114%`;

  finalImgs['1'].lastElementChild.style.height = `100%`;
  finalImgs['1'].lastElementChild.style.width = `100%`;

  celebSwitch(firstCeleb);

}

finalImgs['1'].onclick = () => {

  finalImgs['1'].lastElementChild.style.height = `114%`;
  finalImgs['1'].lastElementChild.style.width = `114%`;

  finalImgs['0'].lastElementChild.style.height = `100%`;
  finalImgs['0'].lastElementChild.style.width = `100%`;

  celebSwitch(lastCeleb);

}

function resetImgsSize() {

  finalImgs['0'].lastElementChild.style.height = `100%`;
  finalImgs['0'].lastElementChild.style.width = `100%`;

  finalImgs['1'].lastElementChild.style.height = `100%`;
  finalImgs['1'].lastElementChild.style.width = `100%`;

}


function toLastPageNavigation() {

  finalImgs['0'].lastElementChild.src = firstCeleb[0];
  finalImgs['1'].lastElementChild.src = lastCeleb[0];

  getInfo();

  resultsPage.style.display = `flex`;
  button.setAttribute('href', '#results-el');

  bottomCardAnim();
  topCardAnim();

}
