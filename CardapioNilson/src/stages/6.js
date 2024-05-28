import { storage } from '../storage.js'
import { VenomBot } from '../venom.js'
import { menu } from '../menu.js' // Importar o menu

export const menuAlmocoStage = {
  async exec({ from }) {
    const venombot = await VenomBot.getInstance()

    storage[from].stage = STAGES.MENU_ALMOÇO // Definir o estágio para menu de almoço
    let menuMessage = 'Você escolheu Almoço. Aqui está o menu:\n\nAcrescente as opções que desejar incluir na refeição. Cardápio:'

    // Construir a mensagem do menu de almoço
    Object.keys(menu).forEach((key) => {
      menuMessage += `${key} - ${menu[key].description}\n`
    })

    await venombot.sendText({ to: from, message: menuMessage }) // Enviar o menu de almoço
  }
}
