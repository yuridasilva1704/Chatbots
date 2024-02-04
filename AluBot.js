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
let perguntasAprendidas = {};

client.on('message', async (message) => {
  if (!saudacaoRespondida && (saudacao.includes('bom dia') || saudacao.includes('boa tarde') || saudacao.includes('boa noite'))) {
        const apresentacao = `Olá, sou o AluBot e estou aqui para trilhar você nesta nova jornada na terra do amanhecer, (mentira será aqui no WhatsApp mesmo)...
Hoje eu enfrentei diversos demônios, foi um dia cansativo, nada como uma pausa para relaxar. `;
        message.reply(apresentacao);

const pergunta_1 = 'O que gostariam que eu fizesse? Me pergunte algo'
        message.reply(pergunta_1);

        saudacaoRespondida = true;
    }
    else {
        const resposta = responderPergunta(message.body);
        message.reply(resposta);
    }
});

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

    // Se não houver uma resposta pré-programada, verifica se o bot aprendeu algo
    if (perguntasAprendidas[pergunta]) {
        return perguntasAprendidas[pergunta];
    } else {
        const respostaAprendizado = 'Desculpe, não tenho uma resposta para essa pergunta no momento. Gostaria de me ensinar?';
        return respostaAprendizado;
    }
}

client.on('message', (message) => {
    const pergunta = message.body;
    const respostaAprendizado = 'Obrigado por me ensinar! Vou lembrar disso para a próxima vez.';
    
    // Armazena a pergunta e a resposta aprendida
    perguntasAprendidas[pergunta] = respostaAprendizado;

    // Salva as perguntas aprendidas em um arquivo (opcional)
    fs.writeFileSync('perguntasAprendidas.json', JSON.stringify(perguntasAprendidas));
});

client.initialize();