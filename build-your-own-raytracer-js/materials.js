class Material {
    constructor(ambientColor, diffuseColor, specularColor, shininess) {
        this.ka = ambientColor;     // Ambient coefficient
        this.kd = diffuseColor;     // Diffuse coefficient  
        this.kg = specularColor;    // Specular coefficient
        this.a = shininess;         // Shininess exponent
    }
}