// 0.js
import { STAGES } from './index.js';
import { getCurrentHour } from '../utils.js';
import { storage } from '../storage.js';
import { menu } from '../menu.js';

export const initialStage = {
  async exec({ from, venombot }) {
    storage[from].stage = STAGES.CHOOSE_MEAL_TYPE;

    const hour = getCurrentHour();
    let message;

    if (hour >= 9 && hour < 23) {
      message = `👋 Olá! O churrasquinho e frango assado do Nilson está aberto 🍖. *TEMOS ALMOÇO!!!*
      
🍽️ Escolha o tipo de refeição:
1️⃣ - Almoço
2️⃣ - Quentinha
0️⃣ - Falar com atendente`;
    } else {
      message = `👋 Olá! O churrasquinho e frango assado do Nilson está aberto 🍖. 
🔥Cardápio de Churrasco, Bebidas e outros itens:
1️⃣ - Churrasco;
2️⃣ - Bebidas;
0️⃣ - Falar com atendente`;
    }
    
    await venombot.sendText({ to: from, message });
  },
};

// chooseMealTypeStage.js
export const chooseMealTypeStage = {
  async exec({ from, message, venombot }) {
    const selectedOption = message.trim();

    if (selectedOption === '1' || selectedOption === '2') {
      const mealType = selectedOption === '1' ? 'Almoço' : 'Quentinha';
      storage[from].stage = STAGES.MENU_LUNCH;

      let menuMessage = `Você escolheu ${mealType}. Aqui está o menu:\n\n`;

      Object.keys(menu).forEach((key) => {
        if (menu[key].available) {
          menuMessage += `${key} - ${menu[key].description}\n`;
        }
      });

      // Informação sobre seleção múltipla
      menuMessage += '\nLembre-se: Se for necessário inserir mais de uma opção, basta apenas separar o pedido por vírgula (Ex.: 1,2)';

      await venombot.sendText({ to: from, message: menuMessage });
    } else if (selectedOption === '0') {
      storage[from].stage = STAGES.FALAR_COM_ATENDENTE;
      await venombot.sendText({ to: from, message: 'Encaminhando você para um atendente.' });
    } else {
      storage[from].stage = STAGES.FALAR_COM_ATENDENTE;
      await venombot.sendText({ to: from, message: 'Opção inválida. Encaminhando você para um atendente.' });
    }
  },
};

// menuLunchStage.js
export const menuLunchStage = {
  async exec({ from, message, venombot }) {
    const selectedOptions = message.trim().split(','); // Separar as seleções por vírgula
    let confirmationMessages = '';

    selectedOptions.forEach(async (selectedOption) => {
      const menuItem = menu[selectedOption.trim()]; // Trim para remover espaços em branco
      
      if (menuItem && menuItem.available) {
        // Item do menu selecionado e disponível
        confirmationMessages += `✅ ${menuItem.description} adicionado com sucesso!\n`;
      } else {
        // Item do menu inválido ou indisponível
        confirmationMessages += `❌ Opção inválida ou indisponível para ${selectedOption.trim()}.\n`;
      }
    });

    // Envia a confirmação das seleções após processar todas as seleções
    await venombot.sendText({ to: from, message: confirmationMessages });

    // Adiciona novamente as opções do menu após cada seleção
    let menuMessage = 'Aqui está o menu:\n\n';
    Object.keys(menu).forEach((key) => {
      if (menu[key].available) {
        menuMessage += `${key} - ${menu[key].description}\n`;
      }
    });
    
    // Informação sobre seleção múltipla
    menuMessage += '\nLembre-se: Se for necessário inserir mais de uma opção, basta apenas separar o pedido por vírgula (Ex.: 1,2)';

    await venombot.sendText({ to: from, message: menuMessage });
  },
};


export const menuStage = {
  async exec({ from, venombot }) {
    // Lógica para apresentar o cardápio de churrasco e bebidas
  },
};

export const falarComAtendenteStage = {
  async exec({ from, venombot }) {
    // Lógica para falar com um atendente
  },
};
