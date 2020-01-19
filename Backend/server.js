const Websocket = require("ws");
const wss = new Websocket.Server({ port: 3030 });
const tmi = require("tmi.js");
let isListening = true;
let latestMsg = "";

const opts = {
  identity: {
    username: "frawglehgs",
    password: "oauth:sdjtd4gea4ktqyamztqlafgqjbzduh"
  },
  channels: ["xfsn_saber"]
};

const client = new tmi.client(opts);

client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);
client.connect();

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  }
  latestMsg = msg;
  console.log("latest msg: ", latestMsg);
  wss.clients.forEach(onMsgReceived);
}

wss.on("connection", ws => {
  console.log("client connected");
});

onMsgReceived = client => {
  if (client.readyState === Websocket.OPEN) {
    client.send(latestMsg);
  }
};
