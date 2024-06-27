import { storage } from '../storage.js'
import { VenomBot } from '../venom.js'
import { menu } from '../menu.js' // Importar o menu

export const menuQuentinhaStage = {
  async exec({ from }) {
    const venombot = await VenomBot.getInstance()

    storage[from].stage = STAGES.MENU_QUENTINHA // Definir o estágio para menu de quentinha
    // Enviar o menu de almoço
let menuMessage = 'Você escolheu Almoço. Aqui está o menu:\n\n'

// Construir a mensagem do menu de almoço
Object.keys(menu).forEach((key) => {
  const menuItem = menu[key];
  if (menuItem.available) {
    menuMessage += `${key} - ${menuItem.description}\n`;
  }
})

await venombot.sendText({ to: from, message: menuMessage });

  }
}
