// src/stages/orderStage.js
import { VenomBotSingleton } from '../venom.js';
import { menu } from '../menu.js';
import { storage } from '../storage.js';
import { STAGES } from './index.js';

export const orderStage = {
  async exec({ from, message }) {
    const selectedItems = message.trim().split(',');
    let responseMsg = '';

    selectedItems.forEach(item => {
      if (menu[item]) {
        storage[from].items.push(menu[item]);
        responseMsg += `✅ *${menu[item].description}* adicionado com sucesso!\n`;
      }
    });

    responseMsg += '\n\n✅ Itens adicionados até agora:\n';
    storage[from].items.forEach(item => {
      responseMsg += `✅ *${item.description}*\n`;
    });

    responseMsg += '\nDigite outra opção\n#️⃣ - FINALIZAR pedido\n*️⃣ - CANCELAR pedido';

    await VenomBotSingleton.getInstance('optical-session').sendText(from, responseMsg);
  },
};
