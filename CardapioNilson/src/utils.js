// utils.js
export const getCurrentHour = () => {
  const date = new Date();
  return date.getHours();
};

export function generateMenuMessage(menu) {
  let menuMessage = '';

  Object.keys(menu).forEach((key) => {
    if (menu[key].available) {
      menuMessage += `${key} - ${menu[key].description}\n`;
    }
  });

  return menuMessage;
}
