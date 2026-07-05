class Nebula {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(body) {
    // Spatial boundary box check
    return (body.pos.x >= this.x && 
            body.pos.x <= this.x + this.w && 
            body.pos.y >= this.y && 
            body.pos.y <= this.y + this.h);
  }

  applyEffect(body) {
    // Linear Fluid Drag Formulation: F = -k * v
    if (body.velocity.mag() === 0) return;

    let dragForce = body.velocity.copy();
    dragForce.mult(-1); // Apply force directly opposite to current heading
    dragForce.normalize();

    let objectSpeed = body.velocity.mag();
    let computedMagnitude = DRAG_K * objectSpeed;
    
    dragForce.mult(computedMagnitude);
    body.applyForce(dragForce);
  }

  display() {
    push();
    noStroke();
    // Soft transparent purple/blue atmospheric cosmic cloud styling
    fill(80, 40, 140, 25); 
    rect(this.x, this.y, this.w, this.h, 15);
    
    // Inner gas density ring styling
    fill(50, 80, 180, 15);
    rect(this.x + 20, this.y + 20, this.w - 40, this.h - 40, 15);
    pop();
  }
}