// AureoIndexCalculator.ts
// Este archivo contiene la lógica de negocio para calcular el Índice de Proporción Áurea (IPA).

export interface AureoInput {
  gender: 'H' | 'M';      // 'H' = Hombre, 'M' = Mujer
  age: number;            // Años
  heightCm: number;       // Altura en cm
  weightKg: number;       // Peso en kg
  waistCm: number;        // Cintura (Ombligo) - LA CLAVE
  shoulderCm: number;     // Hombros - CLAVE PARA V-TAPER
  chestCm: number;        // Pecho
  bicepsCm: number;       // Bíceps
  thighCm: number;        // Muslo
  calfCm: number;         // Gemelo
  hipCm?: number;         // Cadera (Opcional, crítico en mujeres)
}

export class AureoIndexCalculator {

  /**
   * Calcula el Índice Áureo (IPA) - Fórmula V11.0 (Final)
   */
  static calculate(input: AureoInput): number {
    const {
      gender, age, heightCm, weightKg, waistCm, 
      shoulderCm, chestCm, bicepsCm, thighCm, calfCm, hipCm = 0
    } = input;

    // 1. NORMALIZACIÓN
    const heightM = heightCm / 100.0;

    // 2. MÓDULO ARQUITECTURA
    let muscleSum = 0;
    let waistPenalty = 0;

    if (gender === 'H') {
      // --- HOMBRES (Buscando la V) ---
      // Hombros x1.4 para priorizar anchura. 
      // Promediamos (Hombros + Pecho) para no inflar el total artificialmente.
      const torsoComposite = ((shoulderCm * 1.4) + chestCm) / 2;
      
      muscleSum = torsoComposite + bicepsCm + thighCm + calfCm;
      waistPenalty = waistCm * 3.0; // Penalización estándar
    } else {
      // --- MUJERES (Buscando el Reloj de Arena) ---
      // Hombros x0.7 (Bajamos importancia para no premiar espalda de nadadora).
      const shoulderFactor = 0.7; 
      // Cadera x1.4 (Solo si la cintura es fina < 85cm).
      const hipFactor = (waistCm < 85) ? 1.4 : 1.0;
      
      muscleSum = (hipCm * hipFactor) + (shoulderCm * shoulderFactor) + chestCm + thighCm + bicepsCm + calfCm;
      waistPenalty = waistCm * 4.5; // Penalización estricta para resaltar curvas
    }

    const scoreArchitecture = (muscleSum - waistPenalty) / heightCm;

    // 3. MÓDULO DENSIDAD (Peso / Cintura)
    const scoreDensity = weightKg / waistCm;

    // 4. MÓDULO TITAN (Bonus Altura > 1.70m)
    let bonusTitan = 0;
    if (heightM > 1.70) {
      bonusTitan = (heightM - 1.70) * 2.0;
    }

    // 5. MÓDULO LEGACY (Bonus Edad > 35)
    let bonusLegacy = 0;
    if (age > 35) {
      bonusLegacy = (age - 35) * 0.01;
    }

    // 6. MÓDULO FRENO DE MANO (Castigo IMC > 29)
    const imc = weightKg / (heightM * heightM);
    let imcPenalty = 0;
    if (imc > 29) {
      imcPenalty = (imc - 29) * 0.08;
    }

    // 7. SUMATORIA FINAL
    let finalResult = scoreArchitecture + scoreDensity + bonusTitan + bonusLegacy - imcPenalty + 0.25;

    // 8. CLIPPING VISUAL (-3 a +3)
    if (finalResult > 3.0) finalResult = 3.0;
    if (finalResult < -3.0) finalResult = -3.0;

    return Number(finalResult.toFixed(3));
  }

  /**
   * Obtiene el Título del Rango (13 Niveles - Adaptado por Género)
   */
  static getRankTitle(score: number, gender: 'H' | 'M'): string {
    // ZONA DIVINA
    if (score >= 2.10) return gender === 'H' ? "DIVINO" : "DIVINA"; 
    if (score >= 1.90) return "LEYENDA"; 
    
    // ZONA ÁUREA (La Meta)
    if (score >= 1.618) return gender === 'H' ? "ÁUREO" : "ÁUREA"; 
    
    // ZONA PODER
    if (score >= 1.30) return gender === 'H' ? "SPARTAN" : "AMAZONA"; 
    if (score >= 1.10) return "FITNESS"; 
    
    // ZONA SALUD
    if (score >= 0.90) return gender === 'H' ? "SÓLIDO" : "SÓLIDA"; 
    if (score >= 0.70) return "CONTENDER"; 
    if (score >= 0.40) return "AMATEUR"; 
    
    // ZONA INICIO
    if (score >= 0.00) return "ROOKIE"; 
    if (score >= -0.80) return "HEAVY DUTY"; 
    
    // ZONA PELIGRO
    if (score >= -1.30) return "TANK"; 
    if (score >= -2.10) return "SURVIVOR"; 
    
    return "ESFERA"; 
  }

  /**
   * Obtiene el Color HEX para la UI
   */
  static getRankColor(score: number): string {
    if (score >= 2.10) return "#FFD700"; // Oro Brillante
    if (score >= 1.90) return "#C5A000"; // Oro Oscuro
    if (score >= 1.618) return "#D4AF37"; // METALLIC GOLD (Áureo)
    if (score >= 1.30) return "#9C27B0"; // Violeta Intenso
    if (score >= 1.10) return "#2196F3"; // Azul
    if (score >= 0.90) return "#4CAF50"; // Verde Sólido
    if (score >= 0.70) return "#8BC34A"; // Verde Lima
    if (score >= 0.40) return "#FFC107"; // Amber
    if (score >= 0.00) return "#FF9800"; // Naranja
    if (score >= -0.80) return "#FF5722"; // Naranja Rojizo
    if (score >= -1.30) return "#F44336"; // Rojo
    if (score >= -2.10) return "#B71C1C"; // Rojo Sangre
    return "#212121";                     // Esfera (Casi Negro)
  }
}
