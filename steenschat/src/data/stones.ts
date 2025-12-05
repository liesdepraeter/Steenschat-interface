import stoneData from './stones.json';

export type StoneData = typeof stoneData[number];
export type StoneType = StoneData["name"];

//toegang per steen-naam
export const stoneByName: Record<StoneType, StoneData> = Object.fromEntries(stoneData.map(s => [s.name, s])) as Record<StoneType, StoneData>;

//lijst steen-namen
export const allStoneTypes = stoneData.map(s => s.name) as StoneType[];