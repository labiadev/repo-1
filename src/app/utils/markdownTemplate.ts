export interface StarWarsCharacter {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
}

export const DEFAULT_MARKDOWN_TEMPLATE = `# REGISTRO OFICIAL DE LA HÉROE/VILLANO DE LA GALAXIA

## CERTIFICADO DE ARCHIVOS HISTÓRICOS DE LA HOLONET

Por la autoridad del Senado Galáctico y los Archivos de la Orden Jedi, se expide el presente documento oficial para certificar la existencia y las características registradas del espécimen detallado a continuación en la base de datos de la Holonet.

---

### 🛡️ DATOS DE IDENTIDAD
* **Nombre Completo:** {{name}}
* **Año de Nacimiento:** {{birth_year}}
* **Género:** {{gender}}

### 🧬 ESPECIFICACIONES FÍSICAS
* **Estatura:** {{height}} cm
* **Masa Corporal:** {{mass}} kg
* **Color de Cabello:** {{hair_color}}
* **Color de Piel:** {{skin_color}}
* **Color de Ojos:** {{eye_color}}

---

### 🏛️ SELLO DE AUTENTICIDAD
Este documento ha sido generado de manera digital y encriptado en los servidores centrales de Coruscant. La autenticidad de los datos descritos en esta ficha técnica puede ser validada utilizando el protocolo de transmisión Holonet escaneando el código QR de verificación adjunto.
`;

export function generateCertificateMarkdown(
  character: StarWarsCharacter,
  template: string = DEFAULT_MARKDOWN_TEMPLATE
): string {
  let output = template;
  
  const placeholders: { [key in keyof StarWarsCharacter]: string } = {
    name: character.name,
    height: character.height,
    mass: character.mass,
    hair_color: character.hair_color,
    skin_color: character.skin_color,
    eye_color: character.eye_color,
    birth_year: character.birth_year,
    gender: character.gender,
  };

  Object.entries(placeholders).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    output = output.replace(regex, value || 'Desconocido');
  });

  return output;
}
