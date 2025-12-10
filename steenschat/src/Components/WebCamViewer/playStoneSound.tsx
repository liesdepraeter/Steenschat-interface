import { stoneByName } from "../../data/stones";

export function playStoneSound(stoneName: string) {
  const stone = stoneByName[stoneName];
  if (!stone?.sound) return;

  try {
    const audio = new Audio(stone.sound);
    audio.play().catch(err =>
      console.warn("Kon geluid niet afspelen:", err)
    );
  } catch (err) {
    console.warn("Kon geluid niet laden:", err);
  }
}