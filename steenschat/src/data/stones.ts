import stoneData from './stones.json';

export type StoneData = typeof stoneData[number];
export type StoneType = StoneData["name"];

//toegang per steen-naam
export const stoneByName: Record<StoneType, StoneData> = Object.fromEntries(stoneData.map(s => [s.name, s])) as Record<StoneType, StoneData>;

//lijst steen-namen
export const allStoneTypes = stoneData.map(s => s.name) as StoneType[];

//helper functie: geef text--reverse class als kleur red, orange of blue is
export const shouldReverseText = (variant: StoneType): boolean => {
  const color = stoneByName[variant]?.color;
  return color === 'red' || color === 'orange' || color === 'blue';
};