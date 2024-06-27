const STAGES = {
  INITIAL: 'INITIAL',
  // adicione outras etapas conforme necessário
};

const stageHandlers = {
  [STAGES.INITIAL]: {
    exec: ({ from, message }) => {
      console.log(`Mensagem de ${from}: ${message}`);
      // Adicione a lógica de manuseio da mensagem aqui
    },
  },
  // adicione manipuladores para outras etapas conforme necessário
};

module.exports = { STAGES, stageHandlers };
