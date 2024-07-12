export const getFormatedOvr = (ball) => {
  return Math.floor(ball / 6) + "." + (ball % 6);
};
