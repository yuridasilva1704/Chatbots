const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const stringSimilarity = require('string-similarity');

const client = new Client();

let aprendendoResposta = false;
let perguntaSemResposta = '';
let perguntasAprendidas = loadLearnedResponses(); // Carrega respostas aprendidas

// Array de mensagens relacionadas ao Mobile Legends
const mensagensMobileLegends = [
    'Cuidado com o bush! 🌳',
    'Quem aí está subindo de elo? 🏆',
    'Lembre-se de comprar itens essenciais! 🛡️⚔️',
    'Herois, preparem-se para a batalha! 🚀',
    'Aquele momento tenso quando você erra o ultimate... 😅',
    'Quem é o seu herói favorito em Mobile Legends? 🦸‍♂️🦸‍♀️',
    'Boa sorte, que seus críticos sejam altos! 🎯',
    'Vamos vencer essa partida juntos! 💪',
    'Conteúdo para o canal: Melhores Momentos em Mobile Legends! 📹',
    'Quem precisa de um tanque no time? 🛡️',
    'Cuidado com o bush! 🌳 Evite surpresas desagradáveis!',
    'Quem aí está subindo de elo? 🏆 Ou só sobe a pressão mesmo?',
    'Lembre-se de comprar itens essenciais! 🛡️⚔️ Seja o mestre da build!',
    'Herois, preparem-se para a batalha! 🚀 A vitória nos aguarda!',
    'Aquele momento tenso quando você erra o ultimate... 😅 Oops, habilidade errada!',
    'Quem é o seu herói favorito em Mobile Legends? 🦸‍♂️🦸‍♀️ Ou está na dúvida entre tantos?',
    'Boa sorte, que seus críticos sejam altos! 🎯 E que os inimigos sejam noobs!',
    'Vamos vencer essa partida juntos! 💪 Ou pelo menos tentar...',
    'Conteúdo para o canal: Melhores Momentos em Mobile Legends! 📹 Prepare-se para risadas e jogadas épicas!',
    'Quem precisa de um tanque no time? 🛡️ Jogue com estratégia: tanque na frente, time na vitória!',
    'Por que o herói de Mobile Legends não foi à escola? Porque ele sempre foi "solo"! 😄',
    'Qual é o herói mais organizado em Mobile Legends? O que sempre faz "check-list"! 📋',
    'Por que o mago de Mobile Legends não engorda? Porque ele sempre faz "spell"! ✨',
    'Qual é o herói que não precisa de GPS em Mobile Legends? O que tem "mapa"! 🗺️',
    'Por que o time de Mobile Legends é bom em música? Porque sempre tem "harmony"! 🎵',
];

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente está conectado!');
    // Inicia o envio de mensagens esporadicamente
    enviarMensagemEspera();
    // Inicia o envio de mensagens aleatórias para grupos
    enviarMensagemAleatoriaGrupo();
});

client.on('message', async (message) => {
    const saudacao = message.body.toLowerCase();

    if (aprendendoResposta) {
        perguntasAprendidas[perguntaSemResposta] = { resposta: message.body, similaridades: [] };
        aprendendoResposta = false;
        perguntaSemResposta = '';
        message.reply('Obrigado por me ensinar! Vou lembrar disso para a próxima vez.');
        saveLearnedResponses();
        return;
    }

    // Comando !ensinar para aprender respostas
    if (saudacao.startsWith('!ensinar')) {
        const [, novaPergunta, novaResposta] = saudacao.match(/^!ensinar\s+(.+)\s+(.+)$/);
        const perguntaAprendida = `${novaPergunta} Mr Robot`; // Adiciona "Mr Robot" à pergunta
        perguntasAprendidas[perguntaAprendida.toLowerCase()] = { resposta: novaResposta, similaridades: [] };
        message.reply(`Aprendi uma nova resposta para "${novaPergunta}": ${novaResposta}`);
        saveLearnedResponses();
        return;
    }

    // Comando !apagar para remover perguntas respondidas
    if (saudacao.startsWith('!apagar')) {
        const [, perguntaApagar] = saudacao.match(/^!apagar\s+(.+)$/);
        if (perguntasAprendidas[perguntaApagar.toLowerCase()]) {
            delete perguntasAprendidas[perguntaApagar.toLowerCase()];
            message.reply(`Pergunta "${perguntaApagar}" removida das perguntas aprendidas.`);
            saveLearnedResponses();
        } else {
            message.reply(`Pergunta "${perguntaApagar}" não encontrada nas perguntas aprendidas.`);
        }
        return;
    }

    const resposta = responderPergunta(saudacao);

    if (resposta !== null) {
        message.reply(resposta);

        if (!perguntasAprendidas[saudacao]) {
            aprendendoResposta = true;
            perguntaSemResposta = saudacao;
        }
    }
});

function enviarMensagemAleatoriaGrupo() {
    const grupos = client.groups && client.groups.cache ? client.groups.cache.array() : [];

    if (grupos.length > 0) {
        // Seleciona um grupo aleatório
        const grupoAleatorio = grupos[Math.floor(Math.random() * grupos.length)];

        // Seleciona uma mensagem aleatória
        const mensagemAleatoria = mensagensMobileLegends[Math.floor(Math.random() * mensagensMobileLegends.length)];

        // Envia a mensagem para o grupo
        grupoAleatorio.sendMessage(mensagemAleatoria);
    }
}

function enviarMensagemEspera() {
    // Adicione a lógica para enviar mensagens de espera aqui
    // Exemplo: client.sendMessage('NúmeroDoContato', 'Mensagem de Espera');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadLearnedResponses() {
    try {
        const data = fs.readFileSync('learnedResponses.json');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

function saveLearnedResponses() {
    fs.writeFileSync('learnedResponses.json', JSON.stringify(perguntasAprendidas, null, 2));
}

function responderPergunta(pergunta) {
    const nomeBot = 'MrRobot';
    const similaridades = ['mrobot', 'mr robo', 'robo'];

    const incluiNomeBot = similaridades.some(similaridade => pergunta.toLowerCase().includes(similaridade));

    if (incluiNomeBot) {
        const padroesRespostas = [
            { padrao: /como você está/i, resposta: 'Estou bem, obrigado por perguntar! E você?' },
            { padrao: /qual é o seu nome/i, resposta: 'Meu nome é AluBot.' },
            // ... (outros padrões)
        ];

        for (const par of padroesRespostas) {
            if (par.padrao.test(pergunta)) {
                return par.resposta;
            }
        }

        const perguntaAprendida = procurarPerguntaAprendida(pergunta);
        if (perguntaAprendida) {
            return perguntaAprendida.resposta;
        }

        return 'Desculpe, não tenho uma resposta para essa pergunta no momento. Gostaria de me ensinar?';
    }

    return null;
}

function procurarPerguntaAprendida(pergunta) {
    const similaridades = perguntasAprendidas
        ? Object.keys(perguntasAprendidas).map(perguntaAprendida =>
            ({ perguntaAprendida, similaridade: stringSimilarity.compareTwoStrings(pergunta, perguntaAprendida) })
          )
        : [];

    if (similaridades.length > 0) {
        const perguntaMaisSimilar = similaridades.reduce((maisSimilar, atual) =>
            (atual.similaridade > maisSimilar.similaridade ? atual : maisSimilar),
            { similaridade: 0 }
        );

        if (perguntaMaisSimilar.similaridade > 0.7) {
            return perguntasAprendidas[perguntaMaisSimilar.perguntaAprendida];
        }
    }

    return null;
}

// Inicia o envio de mensagens esporadicamente
enviarMensagemEspera();

client.initialize();

// const qrcode = require('qrcode-terminal');
// const { Client } = require('whatsapp-web.js');
// const { MessageMedia } = require('whatsapp-web.js');
// const fs = require('fs');
// const stringSimilarity = require('string-similarity');

// const client = new Client();

// // Função para responder perguntas
// function responderPergunta(pergunta) {
//     const nomeBot = 'MrRobot'; // Nome do bot
//     const similaridades = ['mrobot', 'mr robo', 'robo']; // Outras formas similares

//     // Verifica se a pergunta contém o nome do bot ou formas similares
//     const incluiNomeBot = similaridades.some(similaridade => pergunta.toLowerCase().includes(similaridade));
    
//     if (incluiNomeBot) {
//         const padroesRespostas = [
//             { padrao: /como você está/i, resposta: 'Estou bem, obrigado por perguntar! E você?' },
//             { padrao: /qual é o seu nome/i, resposta: 'Meu nome é AluBot.' },
//         ];

//         // Procura por padrões pré-programados e retorna a primeira resposta correspondente
//         for (const par of padroesRespostas) {
//             if (par.padrao.test(pergunta)) {
//                 return par.resposta;
//             }
//         }

//         // Se não houver uma resposta pré-programada, verifica se a pergunta foi aprendida
//         const perguntaAprendida = procurarPerguntaAprendida(pergunta);
//         if (perguntaAprendida) {
//             return perguntaAprendida.resposta;
//         }

//         // Se não houver uma resposta pré-programada nem aprendida, retorna uma mensagem padrão
//         return 'Desculpe, não tenho uma resposta para essa pergunta no momento. Gostaria de me ensinar?';
//     }

//     return null; // Retorna null se o nome do bot não estiver incluído na pergunta
// }

// function procurarPerguntaAprendida(pergunta) {
//     // Procura a pergunta aprendida mais similar à pergunta fornecida
//     const similaridades = Object.keys(perguntasAprendidas).map(perguntaAprendida =>
//         ({ perguntaAprendida, similaridade: stringSimilarity.compareTwoStrings(pergunta, perguntaAprendida) })
//     );

//     const perguntaMaisSimilar = similaridades.reduce((maisSimilar, atual) =>
//         (atual.similaridade > maisSimilar.similaridade ? atual : maisSimilar),
//         { similaridade: 0 }
//     );

//     if (perguntaMaisSimilar.similaridade > 0.7) {
//         return perguntasAprendidas[perguntaMaisSimilar.perguntaAprendida];
//     }

//     return null;
// }

// client.on('qr', (qr) => {
//     qrcode.generate(qr, { small: true });
// });

// client.on('ready', () => {
//     console.log('Cliente está conectado!');
// });

// let saudacaoRespondida = false;
// let aprendendoResposta = false;
// let perguntaSemResposta = '';

// // Carrega as respostas aprendidas do arquivo JSON
// let perguntasAprendidas = loadLearnedResponses();

// client.on('message', async (message) => {
//     const saudacao = message.body.toLowerCase();

//     if (aprendendoResposta) {
//         perguntasAprendidas[perguntaSemResposta] = { resposta: message.body, similaridades: [] };
//         aprendendoResposta = false;
//         perguntaSemResposta = '';
//         message.reply('Obrigado por me ensinar! Vou lembrar disso para a próxima vez.');

//         // Salva as respostas aprendidas no arquivo JSON
//         saveLearnedResponses();
//         return;
//     }

//     // Adicione o bloco de comando !ensinar aqui (conforme fornecido anteriormente)

//     if (!saudacaoRespondida && (saudacao.includes('bom dia') || saudacao.includes('boa tarde') || saudacao.includes('boa noite') || saudacao === 'teste')) {
//         const apresentacao = `Olá, sou o AluBot e estou aqui para trilhar você nesta nova jornada na terra do amanhecer, (mentira será aqui no WhatsApp mesmo)...
// Hoje eu enfrentei diversos demônios, foi um dia cansativo, nada como uma pausa para relaxar. `;
//         message.reply(apresentacao);

//         const pergunta_1 = 'O que gostariam que eu fizesse? Me pergunte algo';
//         message.reply(pergunta_1);

//         saudacaoRespondida = true;
//     } else {
//         const resposta = responderPergunta(saudacao);

//         if (resposta !== null) {
//             message.reply(resposta);
            
//             if (!perguntasAprendidas[saudacao]) {
//                 aprendendoResposta = true;
//                 perguntaSemResposta = saudacao;
//             }
//         }
//     }
// });

// // Adicione a função para salvar as respostas aprendidas no arquivo JSON
// function saveLearnedResponses() {
//     fs.writeFileSync('learnedResponses.json', JSON.stringify(perguntasAprendidas, null, 2));
// }

// // Adicione a função para carregar as respostas aprendidas do arquivo JSON
// function loadLearnedResponses() {
//     try {
//         const data = fs.readFileSync('learnedResponses.json');
//         return JSON.parse(data);
//     } catch (error) {
//         return {};
//     }
// }

// client.initialize();
