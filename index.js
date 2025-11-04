const { createClient } = require('bedrock-protocol');
const express = require('express');
const fs = require('fs');

// Load behavior functions
const { handleNightSafety, handleHunger, handleMobAvoidance, handlePathing, respawnIfDead } = require('./behaviors');
const walkLoop = require('./behaviors/walkLoop');

// Create a basic Express server to keep the bot alive
const app = express();
app.get('/', (_, res) => res.send('Bot is alive!'));
app.listen(3000, () => console.log('Keep-alive server running on port 3000'));

// Create bot

    const { createClient } = require('bedrock-protocol');

const config = {
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  username: 'Noxell',
  offline: true,
  version: '1.21.120'
};

let bot = null;
let attempt = 0;
const MAX_ATTEMPTS = 10;        // stop trying after this many attempts (avoid infinite loops)
const BASE_DELAY = 3000;       // base delay in ms
const MAX_DELAY = 120000;      // max delay in ms (2 minutes)
let reconnectTimer = null;

function calcDelay(attempt) {
  // exponential backoff with random jitter
  const exp = Math.min(MAX_DELAY, BASE_DELAY * Math.pow(2, attempt));
  const jitter = Math.floor(Math.random() * (exp * 0.5)); // up to 50% extra random
  return exp + jitter;
}

function startBot() {
  if (attempt >= MAX_ATTEMPTS) {
    console.log('[BOT] Reached max reconnect attempts. Giving up.');
    return;
  }

  console.log(`[BOT] Connecting (attempt ${attempt + 1})...`);
  bot = createClient(config);

  // When successful, reset attempt counter and do minimal actions
  bot.on('join', () => {
    console.log('[BOT] Joined server — connection stable.');
    attempt = 0; // reset attempts on success

    // Wait a short, random time before doing anything noticeable (human-like)
    const wait = 2000 + Math.floor(Math.random() * 3000);
    setTimeout(() => {
      // Do nothing aggressive: avoid auto-chat, auto-move, or mass actions
      // If you must send a message, keep it minimal and spaced out.
      // Example (commented out): bot.queue('text', { message: 'hello world' });
    }, wait);
  });

  // On disconnect or error, schedule reconnect politely
  bot.on('disconnect', (reason) => {
    console.log('[BOT] Disconnected:', reason);
    scheduleReconnect();
  });

  bot.on('error', (err) => {
    console.error('[BOT] Error:', err && err.message ? err.message : err);
    // close/cleanup if needed
    try { bot.close(); } catch (e) {}
    scheduleReconnect();
  });

  // Optional: protect against RAK timeout loops by listening to low-level events (depends on lib)
  bot.on('kicked', (reason) => {
    console.log('[BOT] Kicked:', reason);
    // If kicked for suspicious behavior, stop trying
    scheduleReconnect(true);
  });
}

function scheduleReconnect(stopIfKicked = false) {
  if (stopIfKicked) {
    console.log('[BOT] Stopping reconnect attempts due to kick. Respect server moderation.');
    return;
  }

  attempt += 1;
  if (attempt > MAX_ATTEMPTS) {
    console.log('[BOT] Max attempts exceeded. Not reconnecting.');
    return;
  }

  const delay = calcDelay(attempt - 1); // attempt was incremented already
  console.log(`[BOT] Scheduling reconnect in ${(delay / 1000).toFixed(1)}s (attempt ${attempt}/${MAX_ATTEMPTS})`);

  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(() => {
    startBot();
  }, delay);
}

// Start first connection
startBot();

let isNight = false;

// Bot event handlers
bot.on('spawn', () => {
  console.log('Noxell joined the server!');
  console.log('Noxell spawned! Starting behaviors...');

  walkLoop(bot);
  handlePathing(bot);
});

bot.on('time', (packet) => {
  const time = packet.time;
  isNight = time > 13000;
});

bot.on('update_attributes', () => {
  handleHunger(bot);
});

bot.on('mob_spawn', () => {
  handleMobAvoidance(bot);
});

bot.on('death_info', () => {
  respawnIfDead(bot);
});

// Night safety check every 10 seconds
setInterval(() => {
  if (isNight) {
    handleNightSafety(bot);
  }
}, 10000);
