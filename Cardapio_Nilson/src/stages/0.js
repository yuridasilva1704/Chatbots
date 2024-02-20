import { storage } from '../storage.js'
import { VenomBot } from '../venom.js'
import { STAGES } from './index.js'

export const initialStage = {
  async exec({ from }) {
    storage[from].stage = STAGES.MENU

    const venombot = await VenomBot.getInstance()

    const message = `👋 Olá! O churrasquinho do Nilson está aberto. Estamos disponível!!!
Vamos adiantar seu pedido 🙋‍♂️. Confira nosso catálogo abaixo:
      -----------------------------------
1️⃣ - Fazer pedido
2️⃣ - VERIFICAR TAXA DE ENTREGA
0️⃣ - FALAR COM ATENDENTE
    `
    await venombot.sendText({ to: from, message })
  },
}
