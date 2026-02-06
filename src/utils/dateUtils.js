// src/utils/dateUtils.js
// Snow fall untill Jan 3rd
export const isChristmasSeason = () => {
  const now = new Date();
  const year = now.getFullYear();
  
  // Dec 23 to Dec 31
  const startDec = new Date(year, 11, 23); // Month is 0-indexed (11 = December)
  const endDec = new Date(year, 11, 31);
  
  // Jan 1 to Jan 3
  const startJan = new Date(year, 0, 1);   // January
  const endJan = new Date(year, 0, 3);
  
  const inDecRange = now >= startDec && now <= endDec;
  const inJanRange = now >= startJan && now <= endJan;
  
  return inDecRange || inJanRange;
};