// WalkLoop moves the bot every time it’s called
module.exports = function walkLoop(bot) {
  if (!bot?.entity?.position) return;

  // Initialize pathYaw if undefined
  if (!bot.pathYaw) bot.pathYaw = Math.random() * 360;

  const speed = 0.3; // blocks per tick
  const rad = bot.pathYaw * (Math.PI / 180);
  const dx = Math.sin(rad) * speed;
  const dz = Math.cos(rad) * speed;

  const pos = bot.entity.position;
  const newPos = {
    x: pos.x + dx,
    y: pos.y,
    z: pos.z + dz,
  };

  try {
    bot.queue('move_player', {
      runtime_id: bot.entity.runtime_id,
      position: newPos,
      pitch: 0,
      yaw: bot.pathYaw,
      head_yaw: bot.pathYaw,
      mode: 1, // Creative mode, instant movement
      on_ground: true,
      riding_runtime_id: 0,
      teleportation_cause: 0,
      teleportation_item: 0
    });

    bot.entity.position = newPos;
    console.log(`[WalkLoop] Moving to X:${newPos.x.toFixed(2)} Z:${newPos.z.toFixed(2)}`);
  } catch (err) {
    console.log('WalkLoop error:', err.message);
  }
};
