const venom = require('venom-bot');

class VenomBotSingleton {
  static async createInstance(sessionName) {
    return venom.create(sessionName);
  }
}

module.exports = { VenomBotSingleton };
