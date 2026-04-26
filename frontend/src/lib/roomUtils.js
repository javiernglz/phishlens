const WORDS = [
  'EAGLE', 'SHARK', 'FALCON', 'TIGER', 'COBRA',
  'WOLF',  'STORM', 'BLAZE',  'PIXEL', 'NEXUS',
]

export function generateRoomCode() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)]
  const num  = String(Math.floor(1000 + Math.random() * 9000))
  return `${word}-${num}`
}

export function getOrCreatePlayerId() {
  let id = sessionStorage.getItem('phishlens_player_id')
  if (!id) {
    id = `p_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem('phishlens_player_id', id)
  }
  return id
}
