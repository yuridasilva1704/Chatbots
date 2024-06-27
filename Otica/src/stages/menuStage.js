// src/stages/menuStage.js
import { VenomBotSingleton } from '../venom.js';
import { menu } from '../menu.js';
import { storage } from '../storage.js';
import { STAGES } from './index.js';

export const menuStage = {
  async exec({ from, message }) {
    if (message.trim() === '1') {
      let menuMessage = '📋 Aqui estão nossos produtos:\n\n';
      Object.keys(menu).forEach((key) => {
        if (menu[key].available) {
          menuMessage += `${key} - ${menu[key].description}\n`;
        }
      });
      await VenomBotSingleton.getInstance('optical-session').sendText(from, menuMessage);
      storage[from].stage = STAGES.ORDER;
    } else if (message.trim() === '2') {
      const msg = '🔃 Encaminhando você para um atendente. Por favor, aguarde.';
      await VenomBotSingleton.getInstance('optical-session').sendText(from, msg);
      // Lógica para encaminhar ao atendente
    } else {
      const msg = '❌ Opção inválida. Por favor, digite 1 ou 2.';
      await VenomBotSingleton.getInstance('optical-session').sendText(from, msg);
    }
  },
};
