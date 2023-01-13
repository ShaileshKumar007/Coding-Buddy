import bot from './assets/chatbot.png';
import person from './assets/person.png';


const form = document.querySelector('form');
const Container = document.querySelector('#container');

let loading;


function textTyping(element, text){
  let count = 0;

  let interval = setInterval(() => {
    if(count < text.length){
      element.innerHTML += text.charAt(count);
      count++;
    }
    else{
      clearInterval(interval);
    }
  }, 30);
}

function loader(ele){
  ele.textContent = '';

  loading = setInterval(() => {
    ele.textContent+='.';

    if(ele.textContent==="...."){
      ele.textContent = '';
    }
  }, 500);
}


function generateUniqueKey() {
  const time = Date.now();
  const randomNumber = Math.random();
  const hexadeciString = randomNumber.toString(16);

  return `id-${time}-${hexadeciString}`;

}

function chatArea(isBot, value, uniqueKey){

  return (
    `
    <div class="strip ${isBot && 'chatbot'}">

      <div class="chatBox">

        <div class="profile">

          <img src="${isBot? bot : person}" alt="${isBot? "bot" : "person"}" />

        </div>

        <div class="message" id=${uniqueKey}>${value}</div>

      </div>

    </div>
    `
  )

}


const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user
  Container.innerHTML += chatArea(false, data.get('prompt'));

  form.reset();

  // bot
  const uniqueKey = generateUniqueKey();
  Container.innerHTML += chatArea(true, " ",uniqueKey);

  Container.scrollTop = Container.scrollHeight;

  const messageDiv = document.getElementById(uniqueKey); 
  loader(messageDiv);
 

  // fetching the bot's response

  const response = await fetch('https://coding-buddy.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loading);
  messageDiv.innerHTML = '';

  if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();

    textTyping(messageDiv, parsedData);
  }
  else{
    const err = await response.text();

    messageDiv.innerHTML = "Some error occured!";

    alert(err); 
  }
}


form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
});