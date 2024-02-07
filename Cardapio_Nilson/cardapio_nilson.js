const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const { MessageMedia } = require('whatsapp-web.js');

const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente está conectado!');
});

client.on('message', async (message) => {
const saudacao = message.body.toLowerCase();

if (!saudacaoRespondida && (saudacao.includes('bom dia') || saudacao.includes('boa tarde') || saudacao.includes('boa noite') || saudacao === 'teste')) {

}
});
