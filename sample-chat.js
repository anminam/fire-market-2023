let socket = null;
// const server_name = 'http://localhost:3000';
const fireTokenBox = document.getElementById('fToken');
const userIdBox = document.getElementById('userId');

const msgBox = document.getElementById('exampleFormControlTextarea1');
const msgCont = document.getElementById('data-container');
const roomCont = document.getElementById('room-data-container');
const room = document.getElementById('room');
const chattings = document.getElementById('chattings');

//get old messages from the server
let messages = [];
const rooms = [];

fireTokenBox.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    connectSocket(e.target.value);
    e.target.disabled = true;
  }
});

//
function connectSocket(ftoken) {
  socket = io(server_name, {
    auth: {
      token: `Bearer ${ftoken}`,
    },
    transports: ['websocket', 'polling'],
  });

  //Listen to recMessage event to get the messages sent by users
  socket.on('recMessage', (message) => {
    if (document.getElementById('room').value === message.roomNm) {
      messages.push(message);
      loadDate(messages);
    } else {
      const room = document.getElementById(message.roomNm + '-text');

      if (room) {
        room.innerHTML = ` <p
        class="text-sm font-medium text-gray-900 truncate dark:text-white"
      >
        <span class="fw-bolder">*${message.roomNm}</span>
      </p>
      <p class="text-sm text-gray-500 truncate dark:text-gray-400" >
        ${message.text}
      </p>`;
      } else {
        roomCont.innerHTML += ` <li class="pb-3 sm:pb-4" onclick="getMessage('${message.roomNm}')" id='${message.roomNm}'>
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <img
              class="w-8 h-8 rounded-full"
              src="/docs/images/people/profile-picture-1.jpg"
              alt="상품 이미지"
            />
          </div>
          <div class="flex-1 min-w-0" id='${message.roomNm}-text'>
            <p
              class="text-sm font-medium text-gray-900 truncate dark:text-white"
            >
            <span class="fw-bolder">${message.roomNm}</span>
            </p>
            <p class="text-sm text-gray-500 truncate dark:text-gray-400" >
            ${message.text}
            </p>
          </div>
        </div>
      </li>`;
      }
    }
    console.log(message);
  });

  getRooms();
}

function getRooms() {
  fetch(`${server_name}/api/rooms`, {
    headers: {
      Authorization: `Bearer ${fireTokenBox.value}`,
    },
  })
    .then((response) => response.json())
    .then(({ rooms: data }) => {
      loadRoom(data);
      data.forEach((el) => {
        rooms.push(el);
      });
    })
    .catch((err) => console.error(err));
}

function getMessage(roomNm) {
  messages = [];
  fetch(`${server_name}/api/chat/${roomNm}`, {
    headers: {
      Authorization: `Bearer ${fireTokenBox.value}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // chattings.classList.remove('invisible');
      loadDate(data);
      data.forEach((el) => {
        messages.push(el);
      });
    })
    .catch((err) => console.error(err));
  document.getElementById('room').value = roomNm;
  const room = document.getElementById(roomNm + '-text');
  if (room) {
    room.innerHTML = room.innerHTML.replace(
      '<span class="fw-bolder">*',
      '<span class="fw-bolder">'
    );
  }
}

//When a user press the enter key, send message.
msgBox.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    sendMessage({
      roomNm: room.value,
      text: e.target.value,
    });
    e.target.value = '';
  }
});

//Display messages to the users
function loadDate(data) {
  let chatData = '';
  data.map((message) => {
    // <div class="flex items-center self-end rounded-xl rounded-tr bg-blue-500 py-2 px-3 text-white">
    //     <p>This is a sender message</p>
    //   </div>
    //   <div class="flex items-center self-start rounded-xl rounded-tl bg-gray-300 py-2 px-3">
    //     <p>This is a receiver message</p>
    //   </div>

    chatData += `<div class="flex items-center ${
      parseInt(userIdBox.value) === parseInt(message.userId)
        ? 'self-end'
        : 'self-start'
    }"><p>${message.userId}</p></div><div class="${
      parseInt(userIdBox.value) === parseInt(message.userId)
        ? 'flex items-center self-end rounded-xl rounded-tr bg-blue-500 py-2 px-3 text-white'
        : 'flex items-center self-start rounded-xl rounded-tl bg-gray-300 py-2 px-3'
    }">
         <p>${message.text}</p>
       </div>`;
  });
  msgCont.innerHTML = chatData;
  // 화면에 표기 후 읽은 표시 처리
  const lastElement = data[data.length - 1];
  fetch(`${server_name}/api/chat/${lastElement.roomNm}/${lastElement.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${fireTokenBox.value}`,
    },
  });
}

//Display messages to the users
function loadRoom(data) {
  let roomsData = '';
  data.map((message) => {
    const [productId, sellerId, buyerId] = message.roomNm.split('-');
    const readId =
      userIdBox.value === sellerId
        ? 'sellerReadId'
        : userIdBox.value === buyerId
        ? 'buyerReadId'
        : '';

    roomsData += `
    <li class="pb-3 sm:pb-4" onclick="getMessage('${message.roomNm}')" id='${
      message.roomNm
    }'>
    <div class="flex items-center space-x-4">
      <div class="flex-shrink-0">
        <img
          class="w-8 h-8 rounded-full"
          src="/docs/images/people/profile-picture-1.jpg"
          alt="상품 이미지"
        />
      </div>
      <div class="flex-1 min-w-0" id='${message.roomNm}-text'>
        <p
          class="text-sm font-medium text-gray-900 truncate dark:text-white"
        >
        <span class="fw-bolder">${
          message[readId] == message.text.split('::')[0] ? '' : '*'
        }${message.roomNm}</span>
        </p>
        <p class="text-sm text-gray-500 truncate dark:text-gray-400" >
        ${message.text.split('::')[2]}
        </p>
      </div>
    </div>
  </li>
  `;
  });
  roomCont.innerHTML = roomsData;
}

//socket.io
//emit sendMessage event to send message
function sendMessage(message) {
  if (!socket) return;
  socket.emit('sendMessage', message);
  //  joinRoom();
}
