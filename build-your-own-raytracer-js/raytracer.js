const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 192;
const ASPECT_RATIO = CANVAS_WIDTH / CANVAS_HEIGHT;

const cameraPosition = new Vector(0,0,-1);
const image = new Image(CANVAS_WIDTH, CANVAS_HEIGHT);
document.image = image;

const topRightCorner = new Vector(1,0.75,0);
const topLeftCorner = new Vector(-1,0.75,0);
const bottomRightCorner = new Vector(1,-0.75,0);
const bottomLeftCorner = new Vector(-1,-0.75,0);

const materials = {
  red: new Material(new Color(0.2, 0, 0), new Color(0.7, 0, 0), new Color(1, 1, 1), 100),
  bronze: new Material(new Color(0.2125, 0.1275, 0.054), new Color(0.714, 0.4284, 0.18144), new Color(0.393548, 0.271906, 0.166721), 25.6),
  mirror: new Material(new Color(0.0, 0.0, 0.0), new Color(0.1, 0.1, 0.1), new Color(0.9, 0.9, 0.9), 1000),
  blue: new Material(new Color(0.0, 0.0, 0.2), new Color(0.1, 0.1, 0.7), new Color(0.8, 0.8, 0.8), 120),
  floor: new Material(new Color(0.2, 0.2, 0.2), new Color(0.8, 0.8, 0.8), new Color(0.1, 0.1, 0.1), 5)
};

const sphereArray = [];
const redSphere = new Sphere(new Vector(0,0,3), 1, new Color(1, 0, 0), materials.red);
const bronzeSphere = new Sphere(new Vector(-1.5,0,4), 1, new Color(.45, .2, 0), materials.bronze);
const blueSphere = new Sphere(new Vector(1.5, -0.5, 5), 0.5, new Color(0, 0, 1), materials.blue);
const mirrorSphere = new Sphere(new Vector(0.75, 1, 3.5), 0.5, new Color(1,1,1), materials.mirror);

sphereArray.push(redSphere);
sphereArray.push(bronzeSphere);
sphereArray.push(blueSphere);
sphereArray.push(mirrorSphere);


const lightArray = [];
const primaryLight = new Light(new Vector(-5, 5, -2), new Color(0.8, 0.8, 0.8), new Color(1.0, 1.0, 1.0));
const secondaryLight = new Light(new Vector(5, 3, -1), new Color(0.7, 0.7, 0.9), new Color(0.9, 0.9, 1.0));


lightArray.push(primaryLight);
lightArray.push(secondaryLight);

const ambientLightIntensity = new Color(.3, .3, .3);

for (let pixelY = 0; pixelY < CANVAS_HEIGHT; pixelY++) {
  for (let pixelX = 0; pixelX < CANVAS_WIDTH; pixelX++) {
    
    const horizontalRatio = (pixelX + 0.5) / CANVAS_WIDTH;
    const verticalRatio = (pixelY + 0.5) / CANVAS_HEIGHT;

    const topPixelPosition = topLeftCorner.scale(1 - horizontalRatio).add(topRightCorner.scale(horizontalRatio));
    const bottomPixelPosition = bottomLeftCorner.scale(1 - horizontalRatio).add(bottomRightCorner.scale(horizontalRatio));
    const currentPixelPosition = topPixelPosition.scale(1 - verticalRatio).add(bottomPixelPosition.scale(verticalRatio));

    const rayDirection = currentPixelPosition.subtract(cameraPosition).normalize();
    const ray = { origin: cameraPosition, direction: rayDirection};

    let closestDistance = Infinity;
    let hitColor = null;

    let closestSphere = null;

    for (const sphere of sphereArray) {
      const cameraToSphereCenter = ray.origin.subtract(sphere.centre);

      const quadraticA = ray.direction.dot(ray.direction);
      const quadraticB = 2 * (ray.direction.dot(cameraToSphereCenter));

      const quadraticC = (cameraToSphereCenter.dot(cameraToSphereCenter)) - (sphere.r * sphere.r);
      const discriminant = quadraticB * quadraticB - 4 * quadraticA * quadraticC;
      if (discriminant >= 0 ) {

        const firstIntersection = (-quadraticB - Math.sqrt(discriminant)) / (2 * quadraticA);
        const secondIntersection = (-quadraticB + Math.sqrt(discriminant)) / (2 * quadraticA);

        let intersectionDistance = Infinity;
        if (firstIntersection > 0 && firstIntersection < intersectionDistance) intersectionDistance = firstIntersection;
        if (secondIntersection > 0 && secondIntersection < intersectionDistance) intersectionDistance = secondIntersection;

        if (intersectionDistance < closestDistance) {
          closestDistance = intersectionDistance;
          closestSphere = sphere
        }
      }
    }

    if (closestSphere) {
      const intersectionPoint = ray.origin.add(ray.direction.scale(closestDistance));
      const surfaceNormal = intersectionPoint.subtract(closestSphere.centre).normalize();

      let finalColor = closestSphere.material.ka.multiply(ambientLightIntensity);

      for (const light of lightArray) {
        const lightDirection = light.location.subtract(intersectionPoint).normalize();
        
        // Shadow ray implementation
        const shadowRayOrigin = intersectionPoint.add(surfaceNormal.scale(0.001)); // Small offset to avoid self-intersection
        const shadowRay = { origin: shadowRayOrigin, direction: lightDirection };
        
        const maxDistance = intersectionPoint.subtract(light.location).magnitude();
        let isInShadow = false;
        
        // Test shadow ray against all spheres
        for (const sphere of sphereArray) {
          if (sphere === closestSphere) continue; // Skip the sphere we're shading
          
          const shadowCameraToSphereCenter = shadowRay.origin.subtract(sphere.centre);
          const shadowQuadraticA = shadowRay.direction.dot(shadowRay.direction);
          const shadowQuadraticB = 2 * (shadowRay.direction.dot(shadowCameraToSphereCenter));
          const shadowQuadraticC = (shadowCameraToSphereCenter.dot(shadowCameraToSphereCenter)) - (sphere.r * sphere.r);
          const shadowDiscriminant = shadowQuadraticB * shadowQuadraticB - 4 * shadowQuadraticA * shadowQuadraticC;
          
          if (shadowDiscriminant >= 0) {
            const shadowFirstIntersection = (-shadowQuadraticB - Math.sqrt(shadowDiscriminant)) / (2 * shadowQuadraticA);
            const shadowSecondIntersection = (-shadowQuadraticB + Math.sqrt(shadowDiscriminant)) / (2 * shadowQuadraticA);
            
            // Check if either intersection is between the surface and the light
            if ((shadowFirstIntersection > 0.001 && shadowFirstIntersection < maxDistance) ||
                (shadowSecondIntersection > 0.001 && shadowSecondIntersection < maxDistance)) {
              isInShadow = true;
              break; // Early exit - we found a shadow caster
            }
          }
        }
        
        // Only calculate lighting if not in shadow
        if (!isInShadow) {
          const normalDotLight = surfaceNormal.dot(lightDirection);

          if (normalDotLight > 0) {
            const materialDiffuse = closestSphere.material.kd;
            
            const lightDiffuseIntensity = light.diffuseInten;

            const diffuseIntensity = materialDiffuse.multiply(lightDiffuseIntensity);

            const diffuseContribution = diffuseIntensity.scale(normalDotLight);

            finalColor = finalColor.add(diffuseContribution);

            const reflectionDirection = (surfaceNormal.scale(2 * normalDotLight).subtract(lightDirection));
            const viewDirection = cameraPosition.subtract(intersectionPoint).normalize();
            
            const reflectionDotView = reflectionDirection.dot(viewDirection);
            if (reflectionDotView > 0) {
              const specularPower = Math.pow(reflectionDotView, closestSphere.material.a);
              const specularIntensity = closestSphere.material.kg.multiply(light.specInten);
              const specularContribution = specularIntensity.scale(specularPower);
              finalColor = finalColor.add(specularContribution);
            }
          }
        }
      }
      
      finalColor.r = Math.max(0, Math.min(1, finalColor.r));
      finalColor.g = Math.max(0, Math.min(1, finalColor.g));
      finalColor.b = Math.max(0, Math.min(1, finalColor.b));

      image.putPixel(pixelX, pixelY, {
        r: finalColor.r * 255,
        g: finalColor.g * 255,
        b: finalColor.b * 255,
      });
    } else {
      image.putPixel(pixelX, pixelY, { r:0, g:0, b:0});
    }
  }
}
image.renderInto(document.querySelector('body'));



