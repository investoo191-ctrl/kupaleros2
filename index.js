const { createClient } = require('bedrock-protocol')
const http = require('http')

/* ======================
   CONFIG
   ====================== */
const BASE_CONFIG = {
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  version: '1.21.120',
  offline: true
}

const BOT_A = { ...BASE_CONFIG, username: 'Noxella' }
const BOT_B = { ...BASE_CONFIG, username: 'Noxellb' }

const JOIN_TIME = 18 * 60 * 1000 // 18 minutes
const SWITCH_TIME = 15 * 60 * 1000 // 15 minutes

let activeBot = null
let activeName = null
let walkInterval = null

/* ======================
   START BOT
   ====================== */
function startBot(config, name) {
  console.log(`🚀 Starting ${name}...`)
  const bot = createClient(config)

  bot.on('spawn', () => {
    console.log(`✅ ${name} spawned`)
    startWalkLoop(bot, name)
  })

  bot.on('text', p => {
    console.log(`[${name}] ${p.message}`)
  })

  bot.on('kick', p => {
    console.log(`❌ ${name} kicked:`, p.reason)
  })

  bot.on('error', e => {
    console.log(`⚠️ ${name} error:`, e.message)
  })

  return bot
}

/* ======================
   STOP BOT
   ====================== */
function stopBot() {
  if (!activeBot) return

  console.log(`👋 ${activeName} leaving server`)
  clearInterval(walkInterval)
  walkInterval = null

  try {
    activeBot.disconnect()
  } catch {}

  activeBot = null
  activeName = null
}

/* ======================
   WALK LOOP
   ====================== */
function startWalkLoop(bot, name) {
  let angle = Math.random() * Math.PI * 2

  walkInterval = setInterval(() => {
    if (!bot?.entity?.position) return

    const pos = bot.entity.position
    const speed = 0.2 + Math.random() * 0.15
    angle += (Math.random() * 0.6) - 0.3

    const newPos = {
      x: pos.x + Math.cos(angle) * speed,
      y: pos.y,
      z: pos.z + Math.sin(angle) * speed
    }

    bot.queue('move_player', {
      runtime_id: bot.entity.runtime_id,
      position: newPos,
      pitch: 0,
      yaw: angle * 180 / Math.PI,
      head_yaw: angle * 180 / Math.PI,
      mode: 0,
      on_ground: true,
      riding_runtime_id: 0,
      teleportation_cause: 0,
      teleportation_item: 0
    })

    bot.entity.position = newPos
    console.log(`[${name} Walk] x=${newPos.x.toFixed(2)} z=${newPos.z.toFixed(2)}`)
  }, 1500)
}

/* ======================
   BOT ROTATION LOGIC
   ====================== */
function startRotation() {
  // Start BOT A first
  activeBot = startBot(BOT_A, 'BOT_A')
  activeName = 'BOT_A'

  // After 15 min → switch to BOT B
  setTimeout(() => {
    stopBot()
    activeBot = startBot(BOT_B, 'BOT_B')
    activeName = 'BOT_B'
  }, SWITCH_TIME)

  // Full loop every 18 min
  setInterval(() => {
    stopBot()

    if (activeName === 'BOT_A') {
      activeBot = startBot(BOT_B, 'BOT_B')
      activeName = 'BOT_B'
    } else {
      activeBot = startBot(BOT_A, 'BOT_A')
      activeName = 'BOT_A'
    }
  }, JOIN_TIME)
}

/* ======================
   HTTP SERVER (RENDER)
   ====================== */
const PORT = process.env.PORT || 3000

http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Minecraft Bedrock bot rotation running ✅')
}).listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 HTTP server on ${PORT}`)
})

/* ======================
   START EVERYTHING
   ====================== */
startRotation()
