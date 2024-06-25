// src/index.js
import { VenomBotSingleton } from './venom.js';
import { STAGES, stageHandlers } from './stages/index.js';
import { storage } from './storage.js';

const startNewSession = async (sessionName) => {
  const instance = await VenomBotSingleton.createInstance(sessionName);

  instance.onMessage((message) => {
    const from = message.from;
    if (!storage[from]) {
      storage[from] = { stage: STAGES.INITIAL, items: [] };
    }
    const currentStage = storage[from].stage;
    stageHandlers[currentStage].exec({ from, message: message.body });
  });
};

startNewSession('optical-session');
