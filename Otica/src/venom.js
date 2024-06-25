// src/venom.js
import { create } from 'venom-bot';

class VenomBot {
  constructor() {
    this.instances = {};
  }

  async createInstance(sessionName) {
    if (this.instances[sessionName]) return this.instances[sessionName];
    
    const instance = await create(
      sessionName,
      (base64Qr, asciiQR, attempts, urlCode) => {
        console.log(`Session: ${sessionName}`);
        console.log(`QR Code: ${asciiQR}`);
      },
      (statusSession, session) => {
        console.log(`Session ${session} status: ${statusSession}`);
      },
      {
        multidevice: true, // for multidevice support
        logQR: false, // Log QR code in terminal
      }
    );

    this.instances[sessionName] = instance;
    return instance;
  }

  getInstance(sessionName) {
    return this.instances[sessionName];
  }
}

export const VenomBotSingleton = new VenomBot();
