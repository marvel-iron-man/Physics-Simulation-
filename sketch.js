// --- Global Physics Configuration ---
let G = 1.2;                   // Universal Gravitational Constant
let DRAG_K = 0.04;             // Nebula gas density parameter
let GRAVITY_SIGN = 1;          // 1 = Attraction, -1 = Repulsion

// --- Simulation State ---
let bodies = [];
let nebulaZone;
let showOverlay = true;
let currentMode = "CALM";      // Toggle states: "CALM" <-> "CHAOTIC"
let activeSeed = 42;           // Seed for deterministic generation

function setup() {
  createCanvas(windowWidth, windowHeight);
  initializeSimulation(activeSeed);
}

function draw() {
  // Low-alpha background creates natural-looking particle trails (Star dust effect)
  background(10, 10, 18, 40); 

  // 1. Render Environment Zone
  nebulaZone.display();

  // 2. Physics Core Loop (N-Body Mutual Interactivity)
  for (let i = 0; i < bodies.length; i++) {
    let currentBody = bodies[i];

    // Check if the body is inside the gaseous nebula cloud
    if (nebulaZone.contains(currentBody)) {
      nebulaZone.applyEffect(currentBody);
    }

    // Accumulate gravitational forces from every other object
    for (let j = 0; j < bodies.length; j++) {
      if (i !== j) {
        currentBody.calculateGravity(bodies[j]);
      }
    }
  }

  // 3. Position Updates, Boundary Cleanup, and Rendering
  // Iterating backwards keeps array splicing safe from index skips
  for (let i = bodies.length - 1; i >= 0; i--) {
    let b = bodies[i];
    b.update();
    b.display();

    // Lifecycle rule: Remove bodies that stray too far off-screen
    if (b.isOffScreen()) {
      bodies.splice(i, 1);
    }
  }

  // 4. Resolve Accretion Events (Collisions and merges)
  handleAccretion();

  // 5. Data Overlay Panel
  if (showOverlay) {
    drawOverlayPanel();
  }
}

// Helper to spawn a fresh or seeded universe
function initializeSimulation(seedValue) {
  randomSeed(seedValue);
  noiseSeed(seedValue);
  bodies = [];

  // Create central Gaseous Nebula cloud (Environment Zone)
  let zoneW = width * 0.45;
  let zoneH = height * 0.45;
  nebulaZone = new Nebula(width / 2 - zoneW / 2, height / 2 - zoneH / 2, zoneW, zoneH);

  // Requirement Check: >= 2 Massive Proto-Stars
  bodies.push(new Body(width / 2 - 100, height / 2, 400, true));
  bodies.push(new Body(width / 2 + 100, height / 2, 400, true));

  // Requirement Check: >= 8 Live Asteroids/Dust bodies
  for (let i = 0; i < 15; i++) {
    let x = random(width * 0.2, width * 0.8);
    let y = random(height * 0.2, height * 0.8);
    // Give them tangential orbital velocity pushes so they don't plunge instantly
    let b = new Body(x, y, random(5, 25), false);
    let orbitalVel = p5.Vector.sub(b.pos, createVector(width / 2, height / 2));
    orbitalVel.rotate(HALF_PI); 
    orbitalVel.setMag(random(1.5, 3.5));
    b.vel = orbitalVel;
    bodies.push(b);
  }
}

// --- Global Collision Resolver ---
function handleAccretion() {
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      let b1 = bodies[i];
      let b2 = bodies[j];

      let d = p5.Vector.dist(b1.pos, b2.pos);
      if (d < b1.radius + b2.radius) {
        // Accretion hit detected: Determine dominant and submissive bodies
        let primary = (b1.mass >= b2.mass) ? b1 : b2;
        let secondary = (b1.mass < b2.mass) ? b1 : b2;

        // Conservation of Linear Momentum: v_new = (m1*v1 + m2*v2) / (m1 + m2)
        let mom1 = p5.Vector.mult(primary.velocity, primary.mass);
        let mom2 = p5.Vector.mult(secondary.velocity, secondary.mass);
        let combinedMomentum = p5.Vector.add(mom1, mom2);
        
        let targetMass = primary.mass + secondary.mass;
        primary.velocity = p5.Vector.div(combinedMomentum, targetMass);
        primary.updateMassAndDimensions(targetMass);
        primary.temperature = 255; // Flash white hot!

        // Remove the swallowed body from the simulation
        let indexToRemove = bodies.indexOf(secondary);
        bodies.splice(indexToRemove, 1);
        return; // Break frame calculations cleanly to prevent index errors
      }
    }
  }
}

// --- Dynamic User Interactivity ---
function mousePressed() {
  if (keyIsDown(SHIFT)) {
    // Spawn a massive proto-star manually
    bodies.push(new Body(mouseX, mouseY, 300, true));
  } else {
    // Spawn simple drifting space dust
    let dust = new Body(mouseX, mouseY, random(8, 30), false);
    dust.vel = createVector(random(-1.5, 1.5), random(-1.5, 1.5));
    bodies.push(dust);
  }
}

function keyPressed() {
  let keyUpper = key.toUpperCase();
  
  if (keyUpper === 'O') showOverlay = !showOverlay;
  
  if (keyUpper === 'T') GRAVITY_SIGN *= -1; // Toggle Attraction <-> Repulsion
  
  if (keyUpper === 'M') {
    // Mode Switching: Shift constants gracefully without interrupting frames
    if (currentMode === "CALM") {
      currentMode = "CHAOTIC";
      G = 3.8;
      DRAG_K = 0.005; // Thin out gas to allow hyper-velocity slingshots
    } else {
      currentMode = "CALM";
      G = 1.2;
      DRAG_K = 0.04;
    }
  }
  
  if (keyUpper === 'R') {
    // Seeded Randomness Reset (Deterministic output)
    initializeSimulation(activeSeed);
  }
  
  if (keyUpper === 'N') {
    // Fresh Seed Generation
    activeSeed = floor(random(10000));
    initializeSimulation(activeSeed);
  }
}

function drawOverlayPanel() {
  push();
  fill(0, 0, 0, 150);
  stroke(100, 100, 250, 100);
  rect(20, 20, 260, 180, 8);
  
  noStroke();
  fill(255);
  textSize(14);
  textFont('monospace');
  text(`[ SYSTEM DIAGNOSTICS ]`, 35, 45);
  textSize(12);
  text(`Active Bodies : ${bodies.length}`, 35, 70);
  text(`Current Mode  : ${currentMode}`, 35, 90);
  text(`Gravity Vector: ${GRAVITY_SIGN > 0 ? "ATTRACT" : "REPEL"}`, 35, 110);
  text(`Active Seed   : ${activeSeed}`, 35, 130);
  
  fill(150, 150, 250);
  text(`Controls: [M] Mode  [T] Toggle Force`, 35, 160);
  text(`          [R] Seed  [N] New Universe`, 35, 175);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}