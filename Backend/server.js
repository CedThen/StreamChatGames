const Websocket = require("ws");
const wss = new Websocket.Server({ port: 3030 });
const tmi = require("tmi.js");
let isListening = true;
let latestMsg = "";
let channelName = "";
let chatTimer = 0;

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
  //wss.clients.forEach(onMsgReceived);
}

wss.on("connection", ws => {
  console.log("client connected");
  ws.on("message", wsMessageHandler);
});

onMsgReceived = client => {
  // if (client.readyState === Websocket.OPEN) {
  //   client.send(latestMsg);
  // }
};

wsMessageHandler = msg => {
  const jsonMsg = JSON.parse(msg);
  console.log(jsonMsg);
  switch (jsonMsg.type) {
    case "setupConfig":
      chatTimer = jsonMsg.payload.inputTimer;
      streamUrlStripped = jsonMsg.payload.streamUrl.trim();
      opts.channels = [streamUrlStripped];
      console.log(opts.channels);
      clientSetup();

      break;

    default:
      break;
  }
};
