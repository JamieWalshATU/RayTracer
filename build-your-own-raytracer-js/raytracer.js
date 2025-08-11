const WIDTH = 256;
const HEIGHT = 192;
const ASPECT = WIDTH / HEIGHT;

const C = new Vector(0,0,-1);
const image = new Image(WIDTH, HEIGHT);
document.image = image;

const x1 = new Vector(1,0.75,0);
const x2 = new Vector(-1,0.75,0);
const x3 = new Vector(1,-0.75,0);
const x4 = new Vector(-1,-0.75,0);

const materials = {
  red: new Material(new Color(0.2, 0, 0), new Color(0.7, 0, 0), new Color(1, 1, 1), 100),
  bronze: new Material(new Color(0.2125, 0.1275, 0.054), new Color(0.714, 0.4284, 0.18144), new Color(0.393548, 0.271906, 0.166721), 25.6),
  mirror: new Material(new Color(0.0, 0.0, 0.0), new Color(0.1, 0.1, 0.1), new Color(0.9, 0.9, 0.9), 1000),
  blue: new Material(new Color(0.0, 0.0, 0.2), new Color(0.1, 0.1, 0.7), new Color(0.8, 0.8, 0.8), 120),
  floor: new Material(new Color(0.2, 0.2, 0.2), new Color(0.8, 0.8, 0.8), new Color(0.1, 0.1, 0.1), 5)
};

const sphereArr = [];
const sphere1 = new Sphere(new Vector(0,0,3), 1, new Color(1, 0, 0), materials.red);
const sphere2 = new Sphere(new Vector(-1.5,0,4), 1, new Color(.45, .2, 0), materials.bronze);
const sphere3 = new Sphere(new Vector(1.5, -0.5, 5), 0.5, new Color(0, 0, 1), materials.blue);
const sphere4 = new Sphere(new Vector(0.75, 1, 3.5), 0.5, new Color(1,1,1), materials.mirror);

sphereArr.push(sphere1);
sphereArr.push(sphere2);
sphereArr.push(sphere3);
sphereArr.push(sphere4);


const lightArr = [];
const light1 = new Light(new Vector(-5, 5, -2), new Color(0.8, 0.8, 0.8), new Color(1.0, 1.0, 1.0));
const light2 = new Light(new Vector(5, 3, -1), new Color(0.7, 0.7, 0.9), new Color(0.9, 0.9, 1.0));


lightArr.push(light1);
lightArr.push(light2);

const ambientLightInten = new Color(.3, .3, .3);

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    
    const alpha = (x + 0.5) / WIDTH;
    const beta = (y + 0.5) / HEIGHT;

    const top = x2.scale(1 - alpha).add(x1.scale(alpha));
    const bottom = x4.scale(1 - alpha).add(x3.scale(alpha));
    const p = top.scale(1 - beta).add(bottom.scale(beta));

    const direction = p.subtract(C).normalize();
    const ray = { origin: C, direction: direction};

    let closest_t = Infinity;
    let hitColor = null;

    let closest_sphere = null;

    for (const sphere of sphereArr) {
      const CO = ray.origin.subtract(sphere.centre);

      const a = ray.direction.dot(ray.direction);
      const b = 2 * (ray.direction.dot(CO));

      const c = (CO.dot(CO)) - (sphere.r * sphere.r);
      const discriminant = b * b - 4 * a * c;
      if (discriminant >= 0 ) {

        const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

        let t = Infinity;
        if (t1 > 0 && t1 < t) t = t1;
        if (t2 > 0 && t2 < t) t = t2;

        if (t < closest_t) {
          closest_t = t;
          closest_sphere = sphere
        }
      }
    }

    if (closest_sphere) {
      const P = ray.origin.add(ray.direction.scale(closest_t));
      const N = P.subtract(closest_sphere.centre).normalize();

      let finalColor = closest_sphere.material.ka.multiply(ambientLightInten);

      for (const light of lightArr) {
        const L = light.location.subtract(P).normalize();
        
        const n_dot_l = N.dot(L);

        if (n_dot_l > 0) {
          const material_kd = closest_sphere.material.kd;
          
          const light_diffuse = light.diffuseInten;

          const diffuse_intensity = material_kd.multiply(light_diffuse);

          const diffuse_contribution = diffuse_intensity.scale(n_dot_l);

          finalColor = finalColor.add(diffuse_contribution);

          const R = (N.scale(2 * n_dot_l).subtract(L));
          const V = C.subtract(P).normalize();
          
          const r_dot_v = R.dot(V);
          if (r_dot_v > 0) {
            const specular_power = Math.pow(r_dot_v, closest_sphere.material.a);
            const specular_intensity = closest_sphere.material.kg.multiply(light.specInten);
            const specular_contribution =  specular_intensity.scale(specular_power);
            finalColor = finalColor.add(specular_contribution);
          }
        }
      }
      
      finalColor.r = Math.max(0, Math.min(1, finalColor.r));
      finalColor.g = Math.max(0, Math.min(1, finalColor.g));
      finalColor.b = Math.max(0, Math.min(1, finalColor.b));

      image.putPixel(x, y, {
        r: finalColor.r * 255,
        g: finalColor.g * 255,
        b: finalColor.b * 255,
      });
    } else {
      image.putPixel(x,y, { r:0, g:0, b:0});
    }
  }
}
image.renderInto(document.querySelector('body'));



