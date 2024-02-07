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

let saudacaoRespondida = false;

client.on('message', async (message) => {
const saudacao = message.body.toLowerCase();

if (!message.fromMe) {
    const mensagemInicial = `Olá! O churrasquinho do Nilson está aberto. Estamos disponíveis! 
Confira nosso catálogo abaixo:
${gerarCatalogo()}`;

client.sendMessage(message.from, mensagemInicial);
saudacaoRespondida = true;
}

if (!saudacaoRespondida == false) {

} else {
    const opcaoEscolhida = saudacao.trim();

    if (opcaoEscolhida === '0' || opcaoEscolhida.toLowerCase() === 'encerrar') {
        // Encerra o atendimento
        const mensagemEncerramento = 'Obrigado por utilizar nossos serviços. Atendimento encerrado.';
        client.sendMessage(message.from, mensagemEncerramento);
        client.logout(); // Isso encerrará a sessão do bot, mas você pode querer lidar com isso de maneira diferente dependendo dos requisitos do seu aplicativo.
    } else if (opcaoEscolhida >= 1 && opcaoEscolhida <= itens.length) {
        // Envie uma imagem ou mensagem correspondente à opção escolhida
        const imagemOuMensagem = obterConteudoPorOpcao(opcaoEscolhida);
        client.sendMessage(message.from, imagemOuMensagem);
    } else {
        // Caso a opção seja inválida
        const mensagemInvalida = 'Opção inválida. Por favor, escolha uma opção válida do catálogo.';
        client.sendMessage(message.from, mensagemInvalida);
    }
}
});

function gerarCatalogo() {
    const itens = [
        { nome: 'Almoco', emoji: '1️⃣' },
        { nome: 'Bebidas', emoji: '2️⃣' },
        { nome: 'Churrasco', emoji: '3️⃣' },
        { nome: 'Carnes', emoji: '4️⃣' },
        { nome: 'Encerrar Atendimento', emoji: '0️⃣' },
    ];

    let catalogo = '';
    for (let i = 0; i < itens.length; i++) {
        catalogo += `${itens[i].emoji} ${itens[i].nome}\n`;
    }

    return catalogo;
}
function obterConteudoPorOpcao(opcao) {
    return `Você escolheu a opção ${opcao}. Adicione aqui a lógica para fornecer o conteúdo correspondente.`;
}
