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

    if (!message.fromMe && !saudacaoRespondida) {
        const mensagemInicial = `Olá! 🎉 O churrasquinho do Nilson está aberto. Estamos disponíveis! 
Confira nosso catálogo abaixo:   
🥩🍖🔥

1️⃣ Almoco
2️⃣ Bebidas
3️⃣ Churrasco
4️⃣ Carnes

0️⃣ Encerrar Atendimento`;

        client.sendMessage(message.from, mensagemInicial);
        saudacaoRespondida = true;
    }

    const opcaoEscolhida = saudacao.trim();

    // Verifica se a opção escolhida é válida
    const opcoesValidas = ['0', '1', '2', '3', '4'];
    if (saudacaoRespondida && opcoesValidas.includes(opcaoEscolhida)) {
        if (opcaoEscolhida === '0') {
            // Encerra o atendimento
            const mensagemEncerramento = 'Obrigado por utilizar nossos serviços. Atendimento encerrado. Caso deseje visualizar novamente nosso catálogo, basta enviar uma nova mensagem. Desejamos a você um excelente dia! 😊';
            client.sendMessage(message.from, mensagemEncerramento);
            saudacaoRespondida = false;
        } else {
            // Envie uma imagem ou mensagem correspondente à opção escolhida
            const imagemOuMensagem = obterConteudoPorOpcao(opcaoEscolhida);
            client.sendMessage(message.from, imagemOuMensagem);
        }
    } else {
        // Opção inválida
        const mensagemInvalida = 'Opção inválida. Por favor, escolha uma opção válida do catálogo.';
        client.sendMessage(message.from, mensagemInvalida);
    }
});

function obterConteudoPorOpcao(opcao) {
    // Adicione aqui a lógica para fornecer o conteúdo correspondente à opção escolhida
    return `Você escolheu a opção ${opcao}.`;
}

client.initialize();
