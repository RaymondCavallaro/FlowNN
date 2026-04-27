import { clamp, TAU } from "./math.js";

export class Visualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.pixelRatio = 1;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.pixelRatio = window.devicePixelRatio || 1;
    this.canvas.width = Math.max(900, Math.floor(rect.width * this.pixelRatio));
    this.canvas.height = Math.max(560, Math.floor(rect.height * this.pixelRatio));
  }

  point(node) {
    return {
      x: node.x * this.canvas.width,
      y: node.y * this.canvas.height,
    };
  }

  draw(network, settings, selection = null) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    ctx.clearRect(0, 0, width, height);
    this.drawField(ctx, width, height);
    this.drawValves(ctx, network, selection);
    this.drawNodes(ctx, network, selection);
    this.drawHud(ctx, network, settings);
  }

  drawField(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#102626");
    gradient.addColorStop(0.5, "#171f2d");
    gradient.addColorStop(1, "#221c20");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#d8fff7";
    ctx.lineWidth = 1 * this.pixelRatio;
    const gap = 54 * this.pixelRatio;
    for (let x = 0; x < width; x += gap) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gap) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawValves(ctx, network, selection) {
    for (const valve of network.valves) {
      const from = this.point(network.getNode(valve.from));
      const to = this.point(network.getNode(valve.to));
      const selected = selection?.kind === "valve" && selection.id === valve.id;
      const openness = 1 - valve.resistance;
      const activity = clamp(valve.activity, 0, 1.8);
      const pressure = clamp(valve.pressure, 0, 1.8);
      const width = (1.5 + openness * 5 + activity * 5) * this.pixelRatio;

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineWidth = width + pressure * 5 * this.pixelRatio + (selected ? 7 * this.pixelRatio : 0);
      ctx.strokeStyle = selected ? "rgba(255, 245, 179, 0.75)" : `rgba(255, 91, 105, ${0.08 + pressure * 0.2})`;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      ctx.lineWidth = width;
      ctx.strokeStyle = `rgba(132, 246, 223, ${0.16 + openness * 0.32 + activity * 0.22})`;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      this.drawArrow(ctx, from, to, activity);
      ctx.restore();
    }
  }

  drawArrow(ctx, from, to, activity) {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const midX = from.x + (to.x - from.x) * 0.7;
    const midY = from.y + (to.y - from.y) * 0.7;
    const size = (7 + activity * 5) * this.pixelRatio;

    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(angle);
    ctx.fillStyle = `rgba(235, 255, 246, ${0.2 + activity * 0.4})`;
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size * 0.55, -size * 0.38);
    ctx.lineTo(-size * 0.34, 0);
    ctx.lineTo(-size * 0.55, size * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawNodes(ctx, network, selection) {
    for (const node of network.nodes) {
      const point = this.point(node);
      const selected = selection?.kind === "node" && selection.id === node.id;
      const active = clamp(node.activation + node.pulse, 0, 2);
      const pressure = clamp(node.pressure / Math.max(0.1, node.threshold), 0, 1.5);
      const radius = (16 + active * 5 + pressure * 4) * this.pixelRatio;

      ctx.save();
      ctx.shadowColor = `rgba(132, 246, 223, ${0.18 + active * 0.22})`;
      ctx.shadowBlur = (12 + active * 18) * this.pixelRatio;
      ctx.fillStyle = nodeFill(node, active);
      ctx.strokeStyle = selected ? "#fff3a8" : "rgba(255,255,255,0.55)";
      ctx.lineWidth = (selected ? 5 : 2) * this.pixelRatio;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (node.role === "hidden" || node.role === "output") this.drawThresholdRing(ctx, point, node, radius);

      ctx.fillStyle = "#102126";
      ctx.font = `${12 * this.pixelRatio}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.id, point.x, point.y);
      ctx.fillStyle = "rgba(235, 255, 247, 0.72)";
      ctx.font = `${10 * this.pixelRatio}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillText(node.label, point.x, point.y + 30 * this.pixelRatio);
      ctx.restore();
    }
  }

  drawThresholdRing(ctx, point, node, radius) {
    const ratio = clamp(node.pressure / node.threshold, 0, 1);
    ctx.save();
    ctx.strokeStyle = `rgba(249, 214, 107, ${0.28 + ratio * 0.6})`;
    ctx.lineWidth = 3 * this.pixelRatio;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius + 5 * this.pixelRatio, -Math.PI / 2, -Math.PI / 2 + TAU * ratio);
    ctx.stroke();
    ctx.restore();
  }

  drawHud(ctx, network, settings) {
    const metrics = network.metrics();
    ctx.save();
    ctx.fillStyle = "rgba(235, 255, 247, 0.72)";
    ctx.font = `${12 * this.pixelRatio}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText(
      `op:${settings.operation.toUpperCase()} mode:${metrics.mode} valves:${settings.valveMode} thresholds:${settings.thresholdMode}`,
      24 * this.pixelRatio,
      32 * this.pixelRatio,
    );
    ctx.restore();
  }

  pick(network, clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * this.pixelRatio;
    const y = (clientY - rect.top) * this.pixelRatio;

    for (const node of network.nodes) {
      const point = this.point(node);
      const distance = Math.hypot(point.x - x, point.y - y);
      if (distance <= 30 * this.pixelRatio) return { kind: "node", id: node.id };
    }

    let best = null;
    for (const valve of network.valves) {
      const from = this.point(network.getNode(valve.from));
      const to = this.point(network.getNode(valve.to));
      const distance = distanceToSegment(x, y, from.x, from.y, to.x, to.y);
      if (distance < 12 * this.pixelRatio && (!best || distance < best.distance)) {
        best = { kind: "valve", id: valve.id, distance };
      }
    }

    return best ? { kind: best.kind, id: best.id } : null;
  }
}

function nodeFill(node, active) {
  if (node.role === "source") return active > 0.02 ? "#d9fff5" : "#b9cad2";
  if (node.role === "output") return active > 0.02 ? "#fff0b8" : "#d2bea1";
  return active > 0.02 ? "#c8f7df" : "#b9cad2";
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy || 1;
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / lengthSq, 0, 1);
  const x = ax + dx * t;
  const y = ay + dy * t;
  return Math.hypot(px - x, py - y);
}
