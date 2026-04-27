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
    this.drawField(ctx, width, height, network.time);
    this.drawValves(ctx, network, selection);
    this.drawSignals(ctx, network);
    this.drawNodes(ctx, network, settings, selection);
  }

  drawField(ctx, width, height, time) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#102626");
    gradient.addColorStop(0.42, "#171f2d");
    gradient.addColorStop(1, "#211c24");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.24;
    ctx.strokeStyle = "#d8fff7";
    ctx.lineWidth = 1;
    const gap = 46 * this.pixelRatio;
    for (let x = -gap; x < width + gap; x += gap) {
      ctx.beginPath();
      for (let y = 0; y <= height; y += 18 * this.pixelRatio) {
        const wave = Math.sin(y * 0.009 + time * 1.9 + x * 0.008) * 8 * this.pixelRatio;
        if (y === 0) ctx.moveTo(x + wave, y);
        else ctx.lineTo(x + wave, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  drawValves(ctx, network, selection) {
    for (const valve of network.valves) {
      const from = this.point(network.getNode(valve.from));
      const to = this.point(network.getNode(valve.to));
      const pressure = clamp(valve.pressure / 1.8, 0, 1);
      const activity = clamp(valve.activity, 0, 1);
      const selected = selection?.kind === "valve" && selection.id === valve.id;
      const width = (2 + valve.size * 5 + valve.looseness * 8 + activity * 8) * this.pixelRatio;

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineWidth = width + pressure * 8 * this.pixelRatio + (selected ? 8 * this.pixelRatio : 0);
      ctx.strokeStyle = selected ? "rgba(255, 245, 179, 0.7)" : `rgba(255, 79, 92, ${0.08 + pressure * 0.42})`;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      ctx.lineWidth = width;
      ctx.strokeStyle = `hsla(${175 + valve.frequency * 18}, 84%, ${52 + activity * 20}%, ${0.18 + activity * 0.58})`;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      this.drawArrow(ctx, from, to, activity, valve.burst);
      ctx.restore();
    }
  }

  drawArrow(ctx, from, to, activity, burst) {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const midX = from.x + (to.x - from.x) * 0.62;
    const midY = from.y + (to.y - from.y) * 0.62;
    const size = (8 + activity * 10 + burst * 5) * this.pixelRatio;

    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(angle);
    ctx.fillStyle = `rgba(235, 255, 246, ${0.22 + activity * 0.72})`;
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size * 0.65, -size * 0.42);
    ctx.lineTo(-size * 0.38, 0);
    ctx.lineTo(-size * 0.65, size * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawSignals(ctx, network) {
    const signalsByNode = new Map();
    for (const signal of network.signals) {
      signalsByNode.set(signal.nodeId, (signalsByNode.get(signal.nodeId) || 0) + signal.strength);
    }

    for (const [nodeId, strength] of signalsByNode.entries()) {
      const rawNode = network.getNode(nodeId);
      if (!rawNode) continue;
      const node = this.point(rawNode);
      const radius = (18 + clamp(strength, 0, 1.5) * 32) * this.pixelRatio;
      const pulse = Math.sin(network.time * 7 + strength * 2) * 0.5 + 0.5;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const gradient = ctx.createRadialGradient(node.x, node.y, 1, node.x, node.y, radius);
      gradient.addColorStop(0, `rgba(174, 255, 232, ${0.42 + pulse * 0.26})`);
      gradient.addColorStop(1, "rgba(174, 255, 232, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  }

  drawNodes(ctx, network, settings, selection) {
    for (const node of network.nodes) {
      const point = this.point(node);
      const signalStrength = network.signals
        .filter((signal) => signal.nodeId === node.id)
        .reduce((sum, signal) => sum + signal.strength, 0)
        + (network.outputEnergy?.[node.id] ?? 0);
      const active = clamp(signalStrength, 0, 1);
      const selected = selection?.kind === "node" && selection.id === node.id;

      ctx.save();
      ctx.shadowColor = `rgba(132, 246, 223, ${0.22 + active * 0.5})`;
      ctx.shadowBlur = (16 + active * 24) * this.pixelRatio;
      ctx.fillStyle = node.role === "control" ? "#e7c5ff" : node.role === "output" ? "#ffe7a3" : active > 0.02 ? "#d9fff5" : "#b9cad2";
      ctx.strokeStyle = selected ? "#fff3a8" : "rgba(255,255,255,0.55)";
      ctx.lineWidth = (selected ? 5 : 2) * this.pixelRatio;
      ctx.beginPath();
      ctx.arc(point.x, point.y, (17 + active * 8) * this.pixelRatio, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#102126";
      ctx.font = `${13 * this.pixelRatio}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.id, point.x, point.y + 0.5 * this.pixelRatio);
      ctx.fillStyle = "rgba(235, 255, 247, 0.72)";
      ctx.font = `${10 * this.pixelRatio}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillText(node.label || node.role, point.x, point.y + 30 * this.pixelRatio);
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = "rgba(235, 255, 247, 0.72)";
    ctx.font = `${12 * this.pixelRatio}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText(`op:${settings.operation.toUpperCase()} rate:${settings.rate.toFixed(1)} learn:${settings.learning.toFixed(2)}`, 24 * this.pixelRatio, 32 * this.pixelRatio);
    ctx.restore();
  }

  pick(network, clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * this.pixelRatio;
    const y = (clientY - rect.top) * this.pixelRatio;

    for (const node of network.nodes) {
      const point = this.point(node);
      const distance = Math.hypot(point.x - x, point.y - y);
      if (distance <= 28 * this.pixelRatio) return { kind: "node", id: node.id };
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

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy || 1;
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / lengthSq, 0, 1);
  const x = ax + dx * t;
  const y = ay + dy * t;
  return Math.hypot(px - x, py - y);
}
