//1.js
import { VenomBot } from '../venom.js';
import { menu } from '../menu.js';
import { storage } from '../storage.js';
import { neighborhoods } from './neighborhoods.js';
import { STAGES } from './index.js';
import { generateMenuMessage, getCurrentHour } from '../utils.js';

export const stageOne = {
  async exec(params) {
    const message = params.message.trim();
    const isMsgValid = /[0|1|2]/.test(message);

    let msg = '';

    if (message.toLowerCase() === 'encerrar') { // Verifica se a mensagem é "ENCERRAR"
      msg = '🔚 O atendimento foi encerrado. Obrigado por entrar em contato conosco!';
      storage[params.from].stage = STAGES.INICIAL; // Retorna para o estágio inicial
    } else if (isMsgValid) {
      if (message === '1' || message === '2') {
        const hour = getCurrentHour();
        let menuType = {};
        let mealType = '';

        if (message === '1') {
          mealType = 'Almoço';
          if (hour >= 10 && hour < 14) {
            menuType = menu;
          } else {
            menuType = menu;
          }
        } else if (message === '2') {
          mealType = 'Quentinha';
          menuType = menu;
        }

        msg = `Você escolheu ${mealType}. Aqui está o menu:\n\n`;

        Object.keys(menuType).forEach((key) => {
          if (menuType[key].available) {
            msg += `${key} - ${menuType[key].description}\n`;
          }
        });
    
        msg += '\n-----------------------------------\n0️⃣ - ```FALAR COM ATENDENTE```';
    
        storage[params.from].stage = STAGES.CARRINHO;
      } else if (message === '0') {
        msg = '🔃 Encaminhando você para um atendente. \n⏳ *Aguarde um instante*.\n \n⚠️ A qualquer momento, digite *ENCERRAR* para encerrar o atendimento. ⚠️';
        storage[params.from].stage = STAGES.FALAR_COM_ATENDENTE;
      }
    } else {
      msg = '❌ Opção inválida. Encaminhando você para um atendente.';
      storage[params.from].stage = STAGES.FALAR_COM_ATENDENTE;
    }
    
    await VenomBot.getInstance().sendText({ to: params.from, message: msg });

    if (storage[params.from].stage === STAGES.INICIAL) {
      await initialStage.exec(params);
    } else if (storage[params.from].stage === STAGES.FALAR_COM_ATENDENTE) {
      storage[params.from].finalStage = {
        startsIn: new Date().getTime(),
        endsIn: new Date().setSeconds(120),
      };
    }
  },
};

const options = {
  1: ({ from }) => {
    const hour = getCurrentHour();
    let message = '';

    if (hour >= 10 && hour < 14) {
      message = `🚨  CARDÁPIO ALMOÇO  🚨\n\n${generateMenuMessage(menu.lunch)}`;
    } else {
      message = `🚨  CARDÁPIO  🚨\n\n${generateMenuMessage(menu)}`;
    }

    message += '\n-----------------------------------\n0️⃣ - ```FALAR COM ATENDENTE```';

    return {
      message,
      nextStage: STAGES.CARRINHO,
    };
  },
  2: () => {
    const message =
      '\n-----------------------------------\n1️⃣ - ```FAZER PEDIDO``` \n0️⃣ - ```FALAR COM ATENDENTE```\n\n' +
      neighborhoods +
      '\n-----------------------------------\n1️⃣ - ```FAZER PEDIDO``` \n0️⃣ - ```FALAR COM ATENDENTE``` ';

    return {
      message,
      nextStage: null,
    };
  },
  0: () => {
    return {
      message:
        '🔃 Encaminhando você para um atendente. \n⏳ *Aguarde um instante*.\n \n⚠️ A qualquer momento, digite *ENCERRAR* para encerrar o atendimento. ⚠️',
      nextStage: STAGES.FALAR_COM_ATENDENTE,
    };
  },
};
