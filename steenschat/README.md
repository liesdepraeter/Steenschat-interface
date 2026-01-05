Data over de stenen kan aangepast worden in stones.json
Ga naar src -> data -> stones.json
 
Elke steen wordt opgebouwd als volgt:
{
   "name": "rozenkwarts",
   "img": "/images/stones/rozenkwarts.png",
   "sound": "/sounds/stones/rozenkwarts.mp3",
   "color": "red",
   "fact": "Rozenkwarts is, na water en ijs, het meest voorkomende mineraal op aarde",
   "game": "catchgame"
 },
 
# Wat er kan aangepast worden:
name:
geef de steen een nieuwe naam
img:
voeg een nieuwe (of vervang een) afbeelding in public -> images -> stones
geef in img mee ‘/images/stones/[naam-van-bestand.bestandstype]
sound:
voeg een nieuwe (of vervang een) geluid in public -> sounds -> stones
geef in sound mee ‘/sounds/stones/[naam-van-bestand.bestandstype]
color:
kies uit: red, orange, lemon, blue, purple, light-red
fact:
geef een ander feitje mee, maar zorg dat deze niet te lang wordt zodat deze op het scherm blijft passen
game:
koppel een andere game aan de steen, kies uit: catchgame, searchgame