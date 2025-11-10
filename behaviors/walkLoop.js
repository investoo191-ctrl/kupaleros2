// behaviors/walkLoop.js
let tick = 0;

module.exports = function walkLoop(bot) {
  if (!bot?.entity) return;

  // Every 20 ticks (~1 second) pick a new random direction
  if (tick % 20 === 0) {
    bot.pathYaw = Math.random() * 360; // random direction in degrees

    // Convert yaw to forward vector
    const rad = (bot.pathYaw * Math.PI) / 180;
    bot.forwardVector = { x: Math.sin(rad), z: Math.cos(rad) };
  }

  // Set control states
  const speed = 0.2; // adjust as desired

  // Reset previous controls
  bot.setControlState('forward', false);
  bot.setControlState('back', false);
  bot.setControlState('left', false);
  bot.setControlState('right', false);

  // Pick direction based on forwardVector
  const x = bot.forwardVector.x;
  const z = bot.forwardVector.z;

  if (x > 0.3) bot.setControlState('right', true);
  else if (x < -0.3) bot.setControlState('left', true);

  if (z > 0.3) bot.setControlState('forward', true);
  else if (z < -0.3) bot.setControlState('back', true);

  // Optional: Jump randomly to avoid obstacles
  if (tick % 60 === 0 && Math.random() < 0.2) {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 200);
  }

  // Log movement
  if (tick % 20 === 0) {
    console.log(
      `[WalkLoop] Moving. Yaw: ${bot.pathYaw.toFixed(0)}, pos: x:${bot.entity.position.x.toFixed(
        1
      )} z:${bot.entity.position.z.toFixed(1)}`
    );
  }

  tick++;
};
