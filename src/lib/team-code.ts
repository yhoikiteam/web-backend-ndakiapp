const CHARS =
  "ABCDEFGHJKLMNOPQRSTUVWXYZ1234567890";

function randomChar() {
  return CHARS[
    Math.floor(Math.random() * CHARS.length)
  ];
}

export function generateTeamCode(
  mountainCode: string
) {
  let identity = "";

  for (let i = 0; i < 5; i++) {
    identity += randomChar();
  }

  return `${mountainCode}-${identity}`;
}