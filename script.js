const container = document.querySelector('.container');
const chatsContainer = document.querySelector('.chats-container');
const promptForm = document.querySelector('.prompt-form');
const promptInput = promptForm.querySelector('.prompt-input');
const fileInput = promptForm.querySelector('#file-input');
const fileUploadWrapper = promptForm.querySelector('.file-upload-wrapper');
const themeToggleButton = document.querySelector('#theme-toggle-button');
const API_KEY = 'AIzaSyDwENyzAw96HJJd5lrEilyYv7wPQYVNz68';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
const chatHistory = [];
const userData = {message: "",file: {}};
const isLightTheme = localStorage.getItem('themeColor') === 'light_mode';
let typingInterval;
let controller;
document.body.classList.toggle("light-theme",isLightTheme);
themeToggleButton.textContent = isLightTheme ? 'dark_mode' : 'light_mode';
const createMessageElement = (content,...classes) => {
     const div = document.createElement('div');
     div.classList.add('message',...classes);
     div.innerHTML = content;
     return div;
};
const scrollToBottom = () => container.scrollTo({top: container.scrollHeight,behavior: 'smooth'});
const typingEffect = (text,textElement,botMessageDiv) => {
     textElement.textContent = "";
     const words = text.split(" ");
     let wordIndex = 0;
     typingInterval = setInterval(() => {
          if(wordIndex < words.length){
               textElement.textContent += (wordIndex === 0 ? "" : " ") + words[wordIndex++];
               scrollToBottom();
          }else {
               clearInterval(typingInterval);
               botMessageDiv.classList.remove('loading');
               document.body.classList.remove('bot-responding');
          }
     },40);
};
const generateResponse = async (botMessageDiv) => {
     const textElement = botMessageDiv.querySelector('.message-text');
     controller = new AbortController();
     chatHistory.push({
          role: 'user',
          parts: [{text: userData.message},...(userData.file.data ? [{ inline_data: (({fileName,isImage,...rest}) => rest)(userData.file)}] : [])],
     });
     try {
          const response = await fetch(API_URL,{
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({contents: chatHistory}),
               signal: controller.signal,
          });
          const data = await response.json();
          if(!response.ok) throw new Error(data.error.message);
          const responseText = data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g,'$1').trim();
          typingEffect(responseText, textElement, botMessageDiv);
          chatHistory.push({ role: 'model', parts: [{ text: responseText }] });
     } catch (error) {
          textElement.textContent = error.name === 'AbortError' ? 'Response generation stopped.' : error.message;
          textElement.style.color = '#d62939';
          botMessageDiv.classList.remove('loading');
          document.body.classList.remove('bot-responding');
          scrollToBottom();
     } finally {
          userData.file = {};
     }
};
const handleFormSubmit = (event) => {
     event.preventDefault();
     const userMessage = promptInput.value.trim();
     if(!userMessage || document.body.classList.contains('bot-responding')) return;
     userData.message = userMessage;
     promptInput.value = "";
     document.body.classList.add('chats-active', 'bot-responding');
     fileUploadWrapper.classList.remove('file-attached', 'img-attached', 'active');
     const userMsgHTML = `
          <p class="message-text"></p>
          ${userData.file.data ? (userData.file.isImage ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="image-attachment" />` : `<p class="file-attachment"><span class="material-symbols-rounded">description</span>${userData.file.fileName}</p>`) : ""}
     `;
     const userMsgDiv = createMessageElement(userMsgHTML, 'user-message');
     userMsgDiv.querySelector('.message-text').textContent = userData.message;
     chatsContainer.appendChild(userMsgDiv);
     scrollToBottom();
     setTimeout(() => {
          const botMessageHTML = `<img class='avatar' src='gemini.svg'/><p class='message-text'>Just a sec...</p>`;
          const botMessageDiv = createMessageElement(botMessageHTML,'bot-message','loading');
          chatsContainer.appendChild(botMessageDiv);
          scrollToBottom();
          generateResponse(botMessageDiv);
     }, 600);
};
promptForm.addEventListener('submit',handleFormSubmit);
fileInput.addEventListener('change',() => {
     const file = fileInput.files[0];
     if(!file) return;
     const isImage = file.type.startsWith('image/');
     const reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = (event) => {
          fileInput.value = "";
          const base64String = event.target.result.split(',')[1];
          fileUploadWrapper.querySelector('.file-preview').src = event.target.result;
          fileUploadWrapper.classList.add('active', isImage ? 'image-attached' : 'file-attached');
          userData.file = {fileName: file.name,data: base64String,mime_type: file.type,isImage};
     };
});
document.querySelector('#cancel-file-button').addEventListener('click',() => {
     userData.file = {};
     fileUploadWrapper.classList.remove('file-attached','image-attached','active');
});
document.querySelector('#stop-response-button').addEventListener('click',() => {
     controller?.abort();
     userData.file = {};
     clearInterval(typingInterval);
     chatsContainer.querySelector('.bot-message.loading').classList.remove('loading');
     document.body.classList.remove("bot-responding");
});
themeToggleButton.addEventListener('click',() => {
     const isLightTheme = document.body.classList.toggle('light-theme');
     localStorage.setItem('themeColor', isLightTheme ? 'light_mode' : 'dark_mode');
     themeToggleButton.textContent = isLightTheme ? 'dark_mode' : 'light_mode';
});
document.querySelector('#delete-chats-button').addEventListener('click',() => {
     chatHistory.length = 0;
     chatsContainer.innerHTML = "";
     document.body.classList.remove('chats-active','bot-responding');
});
document.querySelectorAll('.suggestions-item').forEach((suggestion) => {
     suggestion.addEventListener('click',() => {
          promptInput.value = suggestion.querySelector('.text').textContent;
          promptForm.dispatchEvent(new Event('submit'));
     });
});
document.addEventListener('click',({target}) => {
     const wrapper = document.querySelector('.prompt-wrapper');
     const shouldHide = target.classList.contains('prompt-input') || (wrapper.classList.contains('hide-controls') && (target.id === 'add-file-button' || target.id === 'stop-response-button'));
     wrapper.classList.toggle("hide-controls",shouldHide);
});
promptForm.querySelector('#add-file-button').addEventListener('click',() => fileInput.click());