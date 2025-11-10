// behaviors/walkLoop.js
let tick = 0;

module.exports = function walkLoop(bot) {
  if (!bot?.entity?.position) return;

  // Random walk every few seconds
  if (tick % 20 === 0) {
    const yaw = Math.random() * Math.PI * 2; // random direction
    const speed = 0.3; // move speed per tick

    // Calculate new position based on yaw
    const dx = Math.sin(yaw) * speed;
    const dz = Math.cos(yaw) * speed;

    const pos = bot.entity.position;
    const newPos = {
      x: pos.x + dx,
      y: pos.y,
      z: pos.z + dz,
    };

    // Send movement packet to server
    bot.queue('move_player', {
      runtime_id: bot.entity.runtime_id,
      position: newPos,
      pitch: 0,
      yaw: yaw * (180 / Math.PI),
      head_yaw: yaw * (180 / Math.PI),
      mode: 0, // NORMAL mode
      on_ground: true,
      riding_runtime_id: 0,
      teleportation_cause: 0,
      teleportation_item: 0,
    });

    // Update local position cache
    bot.entity.position = newPos;

    console.log(`[WalkLoop] Walking to x:${newPos.x.toFixed(2)} z:${newPos.z.toFixed(2)}`);
  }

  tick++;
};
