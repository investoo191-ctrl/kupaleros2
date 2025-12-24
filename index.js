const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const http = require('http')

// ======================
// CONFIG
// ======================
const BOT_CONFIG = {
  host: 'kupaleros-rg1D.aternos.me', // your server IP
  port: 25565,                        // Java port
  username: 'Roxell3365',             // your bot username
  version: '1.21.8',                  // force to known Mineflayer version
  mcData: require('minecraft-data')('1.21.8') // patch to use 1.21.8 definitions
}

const RECONNECT_DELAY = 5000 // 5 seconds

// ======================
// STATE
// ======================
let bot = null
let reconnecting = false

// ======================
// CREATE BOT
// ======================
function startBot() {
  console.log('🚀 Starting bot...')

  bot = mineflayer.createBot(BOT_CONFIG)
  bot.loadPlugin(pathfinder)

  bot.once('spawn', () => {
    console.log('✅ Bot spawned (patched 1.21.11 as 1.21.8)')

    reconnecting = false
    setupPathfinder()
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
    console.log('🔌 Disconnected')
    scheduleReconnect()
  })
}

// ======================
// PATHFINDER SETUP
// ======================
function setupPathfinder() {
  const mcData = BOT_CONFIG.mcData
  const movements = new Movements(bot, mcData)
  movements.allowParkour = false
  movements.canDig = false
  movements.scafoldingBlocks = []
  bot.pathfinder.setMovements(movements)
}

// ======================
// RECONNECT LOGIC
// ======================
function scheduleReconnect() {
  if (reconnecting) return
  reconnecting = true

  console.log(`🔄 Reconnecting in ${RECONNECT_DELAY / 1000}s...`)
  setTimeout(() => {
    try { bot?.quit() } catch {}
    startBot()
  }, RECONNECT_DELAY)
}

// ======================
// HUMAN-LIKE AFK MOVEMENTS
// ======================
function startHumanAFK() {
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

  // Random small walking
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

  // Random jump / sneak
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

// ======================
// UTILS
// ======================
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ======================
// HTTP SERVER (RENDER)
// ======================
const PORT = process.env.PORT || 3000
http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Mineflayer bot (patched 1.21.11) running ✅')
}).listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 HTTP server running on port ${PORT}`)
})

// ======================
// START BOT
// ======================
startBot()const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const http = require('http')

// ======================
// CONFIG
// ======================
const BOT_CONFIG = {
  host: 'kupaleros-rg1D.aternos.me', // your server IP
  port: 40915,                        // Java port
  username: 'Roxell3365',             // your bot username
  version: '1.21.8',                  // force to known Mineflayer version
  mcData: require('minecraft-data')('1.21.8') // patch to use 1.21.8 definitions
}

const RECONNECT_DELAY = 5000 // 5 seconds

// ======================
// STATE
// ======================
let bot = null
let reconnecting = false

// ======================
// CREATE BOT
// ======================
function startBot() {
  console.log('🚀 Starting bot...')

  bot = mineflayer.createBot(BOT_CONFIG)
  bot.loadPlugin(pathfinder)

  bot.once('spawn', () => {
    console.log('✅ Bot spawned (patched 1.21.11 as 1.21.8)')

    reconnecting = false
    setupPathfinder()
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
    console.log('🔌 Disconnected')
    scheduleReconnect()
  })
}

// ======================
// PATHFINDER SETUP
// ======================
function setupPathfinder() {
  const mcData = BOT_CONFIG.mcData
  const movements = new Movements(bot, mcData)
  movements.allowParkour = false
  movements.canDig = false
  movements.scafoldingBlocks = []
  bot.pathfinder.setMovements(movements)
}

// ======================
// RECONNECT LOGIC
// ======================
function scheduleReconnect() {
  if (reconnecting) return
  reconnecting = true

  console.log(`🔄 Reconnecting in ${RECONNECT_DELAY / 1000}s...`)
  setTimeout(() => {
    try { bot?.quit() } catch {}
    startBot()
  }, RECONNECT_DELAY)
}

// ======================
// HUMAN-LIKE AFK MOVEMENTS
// ======================
function startHumanAFK() {
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

  // Random small walking
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

  // Random jump / sneak
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

// ======================
// UTILS
// ======================
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ======================
// HTTP SERVER (RENDER)
// ======================
const PORT = process.env.PORT || 3000
http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Mineflayer bot (patched 1.21.11) running ✅')
}).listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 HTTP server running on port ${PORT}`)
})

// ======================
// START BOT
// ======================
startBot()
