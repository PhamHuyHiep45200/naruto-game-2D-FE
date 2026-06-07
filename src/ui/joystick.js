export function bindJoystick(joystick, onMove) {
  const knob = joystick.querySelector("i");

  const update = event => {
    const bounds = joystick.getBoundingClientRect();
    const radius = bounds.width / 2;
    let x = (event.clientX - bounds.left - radius) / radius;
    let y = (event.clientY - bounds.top - radius) / radius;
    const length = Math.hypot(x, y);

    if (length > 1) {
      x /= length;
      y /= length;
    }

    knob.style.transform = `translate(${x * radius * .5}px, ${y * radius * .5}px)`;
    onMove(x, y);
  };

  const reset = () => {
    knob.style.transform = "translate(0, 0)";
    onMove(0, 0);
  };

  joystick.onpointerdown = event => {
    joystick.setPointerCapture(event.pointerId);
    update(event);
  };
  joystick.onpointermove = event => {
    if (joystick.hasPointerCapture(event.pointerId)) update(event);
  };
  joystick.onpointerup = reset;
  joystick.onpointercancel = reset;
}
