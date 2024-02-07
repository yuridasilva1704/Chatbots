const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

const client = new Client();

// Função para responder perguntas
function responderPergunta(pergunta) {
    const padroesRespostas = [
        { padrao: /como você está/i, resposta: 'Estou bem, obrigado por perguntar! E você?' },
        { padrao: /qual é o seu nome/i, resposta: 'Meu nome é AluBot.' },
    ];

    // Procura por padrões pré-programados e retorna a primeira resposta correspondente
    for (const par of padroesRespostas) {
        if (par.padrao.test(pergunta)) {
            return par.resposta;
        }
    }

    // Se não houver uma resposta pré-programada, verifica se a pergunta foi aprendida
    if (perguntasAprendidas[pergunta]) {
        return perguntasAprendidas[pergunta];
    }

    // Se não houver uma resposta pré-programada nem aprendida, retorna uma mensagem padrão
    return 'Desculpe, não tenho uma resposta para essa pergunta no momento. Gostaria de me ensinar?';
}

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente está conectado!');
});

let saudacaoRespondida = false;
let aprendendoResposta = false;  // Variável de controle para indicar que o bot está aprendendo
let perguntaSemResposta = '';   // Armazena a pergunta sem resposta

let perguntasAprendidas = {};

client.on('message', async (message) => {
    const saudacao = message.body.toLowerCase();

    if (aprendendoResposta) {
        // Se estiver aprendendo, armazena a próxima mensagem como resposta à pergunta sem resposta
        perguntasAprendidas[perguntaSemResposta] = message.body;
        aprendendoResposta = false;  // Sai do modo de aprendizado
        perguntaSemResposta = '';   // Limpa a pergunta sem resposta
        message.reply('Obrigado por me ensinar! Vou lembrar disso para a próxima vez.');
        return;
    }

    if (!saudacaoRespondida && (saudacao.includes('bom dia') || saudacao.includes('boa tarde') || saudacao.includes('boa noite') || saudacao === 'teste')) {
        const apresentacao = `Olá, sou o AluBot e estou aqui para trilhar você nesta nova jornada na terra do amanhecer, (mentira será aqui no WhatsApp mesmo)...
Hoje eu enfrentei diversos demônios, foi um dia cansativo, nada como uma pausa para relaxar. `;
        message.reply(apresentacao);

        const pergunta_1 = 'O que gostariam que eu fizesse? Me pergunte algo';
        message.reply(pergunta_1);

        saudacaoRespondida = true;
    } else {
        const resposta = responderPergunta(saudacao);
        message.reply(resposta);

        // Se não for uma resposta pré-programada, aprende a pergunta
        if (!perguntasAprendidas[saudacao]) {
            aprendendoResposta = true;        // Entra no modo de aprendizado
            perguntaSemResposta = saudacao;   // Armazena a pergunta sem resposta
        }
    }
});

client.initialize();