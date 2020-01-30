const Websocket = require("ws");
const wss = new Websocket.Server({ port: 3030 });
const tmi = require("tmi.js");
let isListening = false;
let latestMsg = "";
let chatTimer = 0;
const madlibLibraryJson = require("./MadlibLibrary.json");

let opts = {
  identity: {
    username: "chatgamesbot",
    password: "oauth:sdjtd4gea4ktqyamztqlafgqjbzduh"
  },
  channels: ["yassuo"]
};

function clientSetup() {
  const client = new tmi.client(opts);
  client.on("message", onMessageHandler);
  client.on("connected", onConnectedHandler);
  client.connect();
}

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  }
  latestMsg = msg;
  console.log("latest msg: ", latestMsg);
  if (isListening) {
    wss.clients.forEach(onMsgReceivedFromTwitch);
  }
}

wss.on("connection", ws => {
  console.log("client connected");
  ws.on("message", wsMessageHandler);
});

onMsgReceivedFromTwitch = client => {
  let newMsg = {
    type: "newMsg",
    payload: latestMsg
  };
  if (client.readyState === Websocket.OPEN) {
    client.send(JSON.stringify(newMsg));
  }
};

wsMessageHandler = msg => {
  const jsonMsg = JSON.parse(msg);
  console.log(jsonMsg);
  switch (jsonMsg.type) {
    case "setupConfig":
      chatTimer = jsonMsg.payload.inputTimer;
      streamUrlStripped = jsonMsg.payload.streamUrl.trim();
      opts.channels = [streamUrlStripped];
      clientSetup();
      break;
    case "getMadlibLibrary":
      console.log("running getMadlibLibrary");
      const libMsg = {
        type: "madlibLibraryJson",
        payload: madlibLibraryJson
      };
      wss.clients.forEach(client => client.send(JSON.stringify(libMsg)));
    default:
      break;
  }
};
