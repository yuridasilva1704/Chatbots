// 2.js
import { VenomBot } from '../venom.js';
import { menu } from '../menu.js';
import { storage } from '../storage.js';
import { STAGES } from './index.js';

export const stageTwo = {
  async exec(params) {
    const message = params.message.trim();
    const isMsgValid = /^[\d,]+$/.test(message); // Verifica se a mensagem contém apenas números e vírgulas

    let msg = '';

    if (message.toLowerCase() === 'encerrar') { // Verifica se a mensagem é "ENCERRAR"
      msg = '🔚 O atendimento foi encerrado. Obrigado por entrar em contato conosco!';
      storage[params.from].stage = STAGES.INICIAL; // Retorna para o estágio inicial
    } else if (isMsgValid) { // Verifica se a mensagem é válida
      const selectedItems = message.split(','); // Divide a mensagem em um array de itens selecionados
      
      selectedItems.forEach(item => {
        if (menu[item]) { // Verifica se o item existe no menu
          storage[params.from].itens.push(menu[item]); // Adiciona o item ao carrinho
          msg += `✅ *${menu[item].description}* adicionado com sucesso!\n`; // Mensagem de confirmação
        }
      });

      // Constrói a mensagem para mostrar os itens adicionados até agora
      msg += '\n\n✅ Itens adicionados até agora:\n';
      storage[params.from].itens.forEach(item => {
        msg += `✅ *${item.description}*\n`;
      });

      // Adiciona as opções de finalizar ou cancelar o pedido
      msg += '\n\nDigite outra opção\n';
      msg += '-----------------------------------\n';
      msg += '#️⃣ - FINALIZAR pedido\n';
      msg += '*️⃣ - CANCELAR pedido';

    } else if (message === '*') { // Verifica se a mensagem é para cancelar o pedido
      const option = options['*']();
      msg = option.message;
      storage[params.from].stage = option.nextStage;
    } else if (message === '#') { // Verifica se a mensagem é para informar o endereço
      const option = options['#']();
      msg = option.message;
      storage[params.from].stage = option.nextStage;
    } else {
      msg = '❌ Opção inválida. Por favor, digite apenas números correspondentes aos itens do cardápio separados por vírgula.';
    }

    await VenomBot.getInstance().sendText({ to: params.from, message: msg });

    // Se a opção for "0", encaminhar para um atendente
    if (message === '0') {
      const atendenteMessage = '🔃 Encaminhando você para um atendente. \n⏳ *Aguarde um instante*.\n \n⚠️ A qualquer momento, digite *ENCERRAR* para encerrar o atendimento. ⚠️';
      await VenomBot.getInstance().sendText({ to: params.from, message: atendenteMessage });
    }
  },
};

const options = {
  '*': () => {
    const message =
      '🔴 Pedido *CANCELADO* com sucesso. \n\n ```Volte Sempre!```';

    return {
      message,
      nextStage: STAGES.INICIAL,
    };
  },
  '#': () => {
    const message =
      '🗺️ Agora, informe o *ENDEREÇO*. \n ( ```Rua, Número, Bairro``` ) \n\n ' +
      '\n-----------------------------------\n*️⃣ - ```CANCELAR pedido```';

    return {
      message,
      nextStage: STAGES.RESUMO,
    };
  },
};
