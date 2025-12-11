/**
 * CreditCalculator - calculates credits for various operations
 */
export class CreditCalculator {
  private static readonly _MIN_SIMULATION_REQUIRED = 40;
  private static readonly _SUB_ENVIRONMENT_PER_ENVIRONMENT = 3;
  private static readonly _MEDIA_SIMULATION_CREDIT_PER_PERSONA_ENVIRONMENT = 9.18; // Credits for 1 persona + 1 environment
  private static readonly _MEDIA_SIMULATION_CREDIT_PER_MB_MEDIA = 2.55; // Credits per MB of media

  private static readonly _CONCEPT_SIMULATION_CREDIT_PER_PERSONA_PRODUCT_ENVIRONMENT =
    6.8; // Credits for 1 persona + 1 product + 1 environment
  private static readonly _PERSONA_CLUSTERING_CREDIT_PER_MB = 11.39; // Credits per MB of data file

  // Persona chat credits
  private static readonly _PERSONA_CHAT_FIRST_GENERATION_BASE = 1.5; // Base credits for first generation (up to 4 personas)
  private static readonly _PERSONA_CHAT_SUBSEQUENT_BASE = 0.8; // Base credits for subsequent messages (up to 4 personas)
  private static readonly _PERSONA_CHAT_ADDITIONAL_CREDIT = 0.5; // Additional credits per persona beyond limit
  private static readonly _PERSONA_CHAT_BASE_LIMIT = 4; // Number of personas included in base price

  /**
   * Calculates media simulation credits.
   *
   * @param personaCount - Number of personas
   * @param mediaSizeBytes - List of media file sizes in bytes
   * @param environmentCount - Number of environments
   * @returns Total credits consumed as number
   */
  static calculateMediaSimulationCredits(
    personaCount: number,
    mediaSizeBytes: number[],
    environmentCount: number
  ): number {
    // Check if we need more personas to meet minimum simulation requirement
    const deviationRequired =
      environmentCount *
        CreditCalculator._SUB_ENVIRONMENT_PER_ENVIRONMENT *
        personaCount <
      CreditCalculator._MIN_SIMULATION_REQUIRED;

    let effectivePersonaCount = personaCount;
    if (deviationRequired) {
      const deviationNeed = Math.floor(
        CreditCalculator._MIN_SIMULATION_REQUIRED /
          (CreditCalculator._SUB_ENVIRONMENT_PER_ENVIRONMENT *
            environmentCount)
      ) + 1;
      effectivePersonaCount = Math.max(personaCount, deviationNeed);
    }

    // Calculate base simulation credits: effective_persona_count × environment_count × 9.18
    const simulationCredits =
      effectivePersonaCount *
      environmentCount *
      CreditCalculator._MEDIA_SIMULATION_CREDIT_PER_PERSONA_ENVIRONMENT;

    // Convert bytes to MB and calculate media credits
    // 1 MB = 1024 * 1024 bytes = 1,048,576 bytes
    const totalSizeMb = mediaSizeBytes.reduce((sum, size) => sum + size, 0) / (1024 * 1024);
    const mediaCredits =
      totalSizeMb * CreditCalculator._MEDIA_SIMULATION_CREDIT_PER_MB_MEDIA;

    // Total credits
    const totalCredits = simulationCredits + mediaCredits;

    return totalCredits;
  }

  /**
   * Calculates concept simulation credits.
   *
   * @param personaCount - Number of personas
   * @param environmentCount - Number of environments
   * @returns Total credits consumed as number
   */
  static calculateConceptSimulationCredits(
    personaCount: number,
    environmentCount: number
  ): number {
    // Check if we need more personas to meet minimum simulation requirement
    const deviationRequired =
      environmentCount *
        CreditCalculator._SUB_ENVIRONMENT_PER_ENVIRONMENT *
        personaCount <
      CreditCalculator._MIN_SIMULATION_REQUIRED;

    let effectivePersonaCount = personaCount;
    if (deviationRequired) {
      const deviationNeed = Math.floor(
        CreditCalculator._MIN_SIMULATION_REQUIRED /
          (CreditCalculator._SUB_ENVIRONMENT_PER_ENVIRONMENT *
            environmentCount)
      ) + 1;
      effectivePersonaCount = Math.max(personaCount, deviationNeed);
    }

    // Calculate base simulation credits: effective_persona_count × environment_count × 6.80
    const simulationCredits =
      effectivePersonaCount *
      environmentCount *
      CreditCalculator._CONCEPT_SIMULATION_CREDIT_PER_PERSONA_PRODUCT_ENVIRONMENT;

    // Total credits
    const totalCredits = simulationCredits;

    return totalCredits;
  }

  /**
   * Calculates OCR credits based on image size.
   *
   * @param imageSizeBytes - List of image file sizes in bytes
   * @returns Total credits consumed as number
   */
  static calculateOcrCredits(imageSizeBytes: number[]): number {
    // Convert bytes to MB and calculate credits
    // 1 MB = 1024 * 1024 bytes = 1,048,576 bytes
    const totalSizeMb = imageSizeBytes.reduce((sum, size) => sum + size, 0) / (1024 * 1024);
    const ocrCredits =
      totalSizeMb * CreditCalculator._MEDIA_SIMULATION_CREDIT_PER_MB_MEDIA;

    return ocrCredits;
  }

  /**
   * Calculates persona clustering credits based on data file size.
   *
   * @param fileSizeBytes - Size of the input data file in bytes
   * @returns Total credits consumed as number
   */
  static calculatePersonaClusteringCredits(fileSizeBytes: number): number {
    // Convert bytes to MB and calculate credits
    // 1 MB = 1024 * 1024 bytes = 1,048,576 bytes
    const totalSizeMb = fileSizeBytes / (1024 * 1024);
    const personaClusteringCredits =
      totalSizeMb * CreditCalculator._PERSONA_CLUSTERING_CREDIT_PER_MB;

    return personaClusteringCredits;
  }

  /**
   * Calculate credits for persona chat based on persona count.
   *
   * @param personaCount - Number of personas being generated
   * @param isFirstGeneration - True if first generation (1.5 base), False for subsequent (0.8 base)
   * @returns Total credits: base + (extra_personas * 0.5)
   *
   * @example
   * - First gen, 3 personas: 1.5 + 0 = 1.5 credits
   * - First gen, 6 personas: 1.5 + (2 × 0.5) = 2.5 credits
   * - Subsequent, 4 personas: 0.8 + 0 = 0.8 credits
   * - Subsequent, 7 personas: 0.8 + (3 × 0.5) = 2.3 credits
   */
  static calculatePersonaChatCredits(
    personaCount: number,
    isFirstGeneration: boolean
  ): number {
    const baseCredits = isFirstGeneration
      ? CreditCalculator._PERSONA_CHAT_FIRST_GENERATION_BASE
      : CreditCalculator._PERSONA_CHAT_SUBSEQUENT_BASE;

    const extraPersonas = Math.max(
      0,
      personaCount - CreditCalculator._PERSONA_CHAT_BASE_LIMIT
    );
    const additionalCredits =
      extraPersonas * CreditCalculator._PERSONA_CHAT_ADDITIONAL_CREDIT;

    return baseCredits + additionalCredits;
  }
}

