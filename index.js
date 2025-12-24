const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const mcData = require('minecraft-data')('1.21.10')
const http = require('http')

/* ======================
   CONFIG
   ====================== */
const BOT_CONFIG = {
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  username: 'Roxell3365',
  version: '1.21.8'
}

const RECONNECT_DELAY = 5000 // 5 seconds (SAFE)

/* ======================
   STATE
   ====================== */
let bot = null
let reconnecting = false

/* ======================
   CREATE BOT
   ====================== */
function startBot () {
  console.log('🚀 Starting bot...')

  bot = mineflayer.createBot(BOT_CONFIG)
  bot.loadPlugin(pathfinder)

  bot.once('spawn', () => {
    console.log('✅ Bot spawned')

    reconnecting = false

    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    movements.allowParkour = false
    movements.canDig = false
    movements.scafoldingBlocks = []

    bot.pathfinder.setMovements(movements)

    startHumanAFK()
  })

  bot.on('kicked', reason => {
    console.log('❌ Kicked:', reason)
    scheduleReconnect()
  })

  bot.on('error', err => {
    console.log('⚠️ Error:', err.message)
    scheduleReconnect()
  })

  bot.on('end', () => {
    console.log('🔌 Disconnected from server')
    scheduleReconnect()
  })
}

/* ======================
   RECONNECT LOGIC
   ====================== */
function scheduleReconnect () {
  if (reconnecting) return
  reconnecting = true

  console.log(`🔄 Reconnecting in ${RECONNECT_DELAY / 1000}s...`)

  setTimeout(() => {
    try {
      bot?.quit()
    } catch {}

    startBot()
  }, RECONNECT_DELAY)
}

/* ======================
   HUMAN-LIKE AFK LOGIC
   ====================== */
function startHumanAFK () {
  console.log('🛡️ Human AFK logic running')

  // Head movement
  setInterval(() => {
    if (!bot?.entity) return
    bot.look(
      bot.entity.yaw + (Math.random() - 0.5) * 0.6,
      bot.entity.pitch + (Math.random() - 0.5) * 0.4,
      true
    )
  }, random(5000, 9000))

  // Casual walking
  setInterval(() => {
    if (!bot?.entity || Math.random() < 0.4) return

    const pos = bot.entity.position
    bot.pathfinder.setGoal(
      new goals.GoalNear(
        Math.floor(pos.x + random(-3, 3)),
        Math.floor(pos.y),
        Math.floor(pos.z + random(-3, 3)),
        1
      )
    )
  }, random(15000, 30000))

  // Rare jump / sneak
  setInterval(() => {
    const roll = Math.random()
    if (roll < 0.2) {
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 250)
    } else if (roll < 0.35) {
      bot.setControlState('sneak', true)
      setTimeout(() => bot.setControlState('sneak', false), 900)
    }
  }, random(20000, 40000))
}

/* ======================
   UTILS
   ====================== */
function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/* ======================
   HTTP SERVER (RENDER)
   ====================== */
const PORT = process.env.PORT || 3000
http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Java Mineflayer bot running ✅')
}).listen(PORT, '0.0.0.0')

/* ======================
   START
   ====================== */
startBot()
