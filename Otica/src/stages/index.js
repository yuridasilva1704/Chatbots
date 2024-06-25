// src/stages/index.js
import { initialStage } from './initialStage.js';
import { menuStage } from './menuStage.js';
import { orderStage } from './orderStage.js';

export const STAGES = {
  INITIAL: 'INITIAL',
  MENU: 'MENU',
  ORDER: 'ORDER',
};

export const stageHandlers = {
  [STAGES.INITIAL]: initialStage,
  [STAGES.MENU]: menuStage,
  [STAGES.ORDER]: orderStage,
};
