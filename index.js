const { createClient } = require('bedrock-protocol');
const http = require('http'); // ✅ ADD THIS

const bot = createClient({
  host: 'kupaleros-rg1D.aternos.me',
  port: 40915,
  offline: true,
  version: '1.21.120',
  username: 'Noxell'
});

bot.on('spawn', () => {
  console.log('✅ Bot spawned! Starting walk loop...');
  startWalkLoop(bot);
});

bot.on('text', p => console.log(`[Server] ${p.message}`));
bot.on('kick', p => console.log('Kicked:', p.reason));
bot.on('error', e => console.log('Error:', e.message));

function startWalkLoop(bot) {
  let tick = 0;
  let angle = 0;

  setInterval(() => {
    if (!bot?.entity?.position) return;

    const pos = bot.entity.position;
    const speed = 0.3;

    angle += Math.PI / 12;
    const newX = pos.x + Math.cos(angle) * speed;
    const newZ = pos.z + Math.sin(angle) * speed;

    const newPos = { x: newX, y: pos.y, z: newZ };

    bot.queue('move_player', {
      runtime_id: bot.entity.runtime_id,
      position: newPos,
      pitch: 0,
      yaw: (angle * 180) / Math.PI,
      head_yaw: (angle * 180) / Math.PI,
      mode: 0,
      on_ground: true,
      riding_runtime_id: 0,
      teleportation_cause: 0,
      teleportation_item: 0
    });

    bot.entity.position = newPos;
    tick++;
    if (tick % 20 === 0)
      console.log(`[Walk] New pos: x=${newX.toFixed(2)} z=${newZ.toFixed(2)}`);
  }, 500);
}

/* ================================
   ✅ REQUIRED FOR RENDER (BOTTOM)
   ================================ */

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Minecraft Bedrock bot is running ✅');
}).listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 HTTP server running on port ${PORT}`);
});
