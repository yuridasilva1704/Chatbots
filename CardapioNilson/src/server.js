//server.js
import { VenomBot } from './venom.js';
import { stages, getStage } from './stages.js';

const main = async () => {
  try {
    const venombot = await VenomBot.getInstance().init({
      session: 'Churrasquinho e frango assado do Nilson',
      headless: true,
      useChrome: false,
    });

    venombot.onMessage(async (message) => {
      if (message.isGroupMsg) return;

      const currentStage = getStage({ from: message.from });

      await stages[currentStage].stage.exec({
        from: message.from,
        message: message.body,
        venombot: venombot, // Passar a instância de venombot como parâmetro
      });
    });
  } catch (error) {
    console.error(error);
  }
};

main();