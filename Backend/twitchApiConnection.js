const tmi = require("tmi.js");
const msgHandler = require("./server");
const opts = {
  identity: {
    username: "frawglehgs",
    password: "oauth:sdjtd4gea4ktqyamztqlafgqjbzduh"
  },
  channels: ["frawglehgs"]
};

const client = new tmi.client(opts);
console.log("imported msg handler: ", msgHandler.onMessageHandler);
client.on("message", msgHandler.onMessageHandler);
client.on("connected", onConnectedHandler);

client.connect();

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
