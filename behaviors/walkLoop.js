// behaviors/walkLoop.js
let tick = 0;

module.exports = function walkLoop(bot) {
  if (!bot?.entity?.position) return;

  // Move every few ticks
  if (tick % 20 === 0) {
    const yaw = Math.random() * Math.PI * 2; // random direction
    const speed = 0.4; // walking speed

    bot.entity.yaw = yaw;

    // Prepare analog stick movement (forward)
    const moveX = Math.sin(yaw) * speed;
    const moveZ = Math.cos(yaw) * speed;

    // Send "auth input" — this is the actual Bedrock movement packet
    bot.queue('player_auth_input', {
      pitch: 0,
      yaw: yaw * (180 / Math.PI),
      input: 0b0001, // bitflag for moving forward
      move_vector: { x: moveX, z: moveZ },
      head_yaw: yaw * (180 / Math.PI),
      position: bot.entity.position,
      tick: BigInt(Date.now())
    });

    console.log(`[WalkLoop] Moving toward yaw=${(yaw * 180 / Math.PI).toFixed(1)}°`);
  }

  tick++;
};
