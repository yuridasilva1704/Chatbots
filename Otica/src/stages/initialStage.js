// src/stages/initialStage.js
import { VenomBotSingleton } from '../venom.js';
import { storage } from '../storage.js';
import { STAGES } from './index.js';

export const initialStage = {
  async exec({ from }) {
    const msg = '👋 Olá! Bem-vindo à Ótica Nilson. Escolha uma das opções abaixo:\n1️⃣ - Ver produtos\n2️⃣ - Falar com um atendente';
    await VenomBotSingleton.getInstance('optical-session').sendText(from, msg);
    storage[from] = { stage: STAGES.MENU, items: [] };
  },
};
