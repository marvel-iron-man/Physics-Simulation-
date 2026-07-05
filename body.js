class Body {
  constructor(x, y, mass, isStar = false) {
    this.pos = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.isStar = isStar;
    this.temperature = 0; // Visual thermal indicator for fusion collisions
    
    this.updateMassAndDimensions(mass);
  }

  updateMassAndDimensions(newMass) {
    this.mass = newMass;
    // Scale visual size non-linearly to look realistic
    this.radius = this.isStar ? sqrt(this.mass) * 1.8 : sqrt(this.mass) * 1.1;
  }

  applyForce(force) {
    // Newton's Second Law: a = F / m
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  calculateGravity(otherBody) {
    let forceDirection = p5.Vector.sub(this.pos, otherBody.pos);
    let distance = forceDirection.mag();

    // Critical Patch: Force-softening constant avoids division by zero singularities
    let minConstraint = this.radius + otherBody.radius;
    if (distance < minConstraint) distance = minConstraint;

    forceDirection.normalize();

    // Classical Universal Gravitation Calculation
    let forceMagnitude = (G * this.mass * otherBody.mass) / (distance * distance);
    let structuralForce = forceDirection.mult(forceMagnitude * GRAVITY_SIGN);

    // Apply the mutual attraction force vectors
    otherBody.applyForce(structuralForce);
  }

  update() {
    // Standard Velocity/Position numerical Euler Integration
    this.velocity.add(this.acceleration);
    this.pos.add(this.velocity);
    this.acceleration.mult(0); // Wipe frame forces clean

    // Natural thermodynamic decay rate
    if (this.temperature > 0) {
      this.temperature -= 4;
    }
  }

  isOffScreen() {
    let padding = 300; // Allow ample orbit space off camera bounds
    return (this.pos.x < -padding || 
            this.pos.x > width + padding || 
            this.pos.y < -padding || 
            this.pos.y > height + padding);
  }

  display() {
    push();
    noStroke();
    
    if (this.isStar) {
      // Radiant Multi-layered Star Aura Glow
      fill(255, 120, 30, 30);
      ellipse(this.pos.x, this.pos.y, this.radius * 2.8);
      fill(255, 180, 50, 80);
      ellipse(this.pos.x, this.pos.y, this.radius * 1.8);
      fill(255, 245, 220);
      ellipse(this.pos.x, this.pos.y, this.radius);
    } else {
      // Asteroid styling changes dynamically based on structural temperature
      if (this.temperature > 0) {
        // Blends white-hot core outward to asteroid base gray
        let hotColor = color(255, 200, 100);
        let baseColor = color(130, 130, 140);
        let currentColor = lerpColor(baseColor, hotColor, this.temperature / 255);
        fill(currentColor);
      } else {
        fill(140, 142, 150);
      }
      ellipse(this.pos.x, this.pos.y, this.radius * 2);
    }
    
    // Feature Overlay: Tiny direction indicators
    if (showOverlay && this.velocity.mag() > 0.1) {
      stroke(0, 255, 150, 150);
      strokeWeight(1.5);
      let previewVector = this.velocity.copy().setMag(this.radius + 10);
      line(this.pos.x, this.pos.y, this.pos.x + previewVector.x, this.pos.y + previewVector.y);
    }
    pop();
  }
}