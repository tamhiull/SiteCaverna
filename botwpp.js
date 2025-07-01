require('dotenv').config();
const fs = require('fs');
const wppconnect = require('@wppconnect-team/wppconnect');
const { GoogleGenerativeAI } = require("@google/generative-ai");

//IMPORTANTE A CHAVE API DO GOOGLE:
const GEMINI_KEY = "digite sua chave";


wppconnect
  .create({
    session: 'sessionName',
    catchQR: (base64Qr, asciiQR) => {
      console.log(asciiQR); 
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      require('fs').writeFile(
        'out.png',
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    logQR: false,
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));

wppconnect
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));


 async function start(client ) {
   const generationConfig = {
     stopSequences: ["red"],
     maxOutputTokens: 200,
     temperature: 0.9,
     topP: 0.1,
     topK: 16,
   };
   
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig });


    client.onMessage(async (message) => {

      const result = await model.generateContent(message.body);
      const response = await result.response;
      const text = response.text();

      if (message.body.toLowerCase()) {
        client
          .sendText(message.from, text)
          .then((result) => {
            console.log('Result: ', result); // Retorna objeto de sucesso
          })
          .catch((erro) => {
            console.error('Erro ao enviar: ', erro); // Retorna objeto de erro
          });
      } 
    }

    )}
    
