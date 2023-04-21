import { Client } from "whatsapp-web.js";
import openAiClient from "./open-api.js";
import qrCode from "qrcode-terminal";

console.log(openAiClient);

console.log("Inside Bot.js");

const msg = "Eid Mubarak Bilal Bhai";
if (msg.toLowerCase().includes("eid mubarak")) {
  console.log("Yes included");
}
const client = new Client();

client.on("qr", (qr) => {
  console.log("Qr is: ", qr);
  qrCode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready");
});

client.on("message", async (message) => {
  try {
    console.log(message);
    const contact = await message.getContact();

    if (message.body.toLowerCase().includes("eid mubarak")) {
      console.log("Inside eid mubarak");
      const senderName = contact?.name || contact?.pushname;
      console.log(senderName);

      const prompt = `Q: ${message.body}\nA:`;
      const result = await openAiClient.complete({
        engine: "text-davinci-002",
        prompt,
        maxTokens: 100,
        n: 1,
        stop: ["\n"],
      });

      const response = result.data.choices[0].text.trim();
      message.reply(response);

      // message.reply(
      //   `${senderName && senderName} Bhai Khair Mubarak❤ apko b Eid Mubarak ❤ `
      // );
    }

    // My Profile Url Chat
    if (message.body.toLowerCase() == "my profile url") {
      const profileUrl = await contact.getProfilePicUrl();
      console.log(profileUrl);
      client.sendMessage(
        message.from,
        `Your Profile Pic Url: ${
          profileUrl ? profileUrl : "Privacy enabled not allowed"
        }`
      );
    }

    // Our Common Groups Chat
    if (message.body.toLowerCase() == "our common groups") {
      const groups = await contact.getCommonGroups();
      let groupsString = "";
      if (groups && groups?.length > 0) {
        for (let i = 0; i < groups.length; i++) {
          const chat = await client.getChatById(groups[i]._serialized);
          console.log(chat?.name);
          groupsString += `${i + 1}. ${chat?.name}.\n `;
        }
      }
      client.sendMessage(
        message.from,
        `Groups in common: \n${groups ? groupsString : "No group common"}`
      );
    }
  } catch (err) {
    console.log(err.message);
  }
});

client.initialize();
