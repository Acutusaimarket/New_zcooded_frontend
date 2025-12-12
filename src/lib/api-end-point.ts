export const personasApiEndPoint = {
  GeneratePersonas: "ai/personas/generate-personas-with-clustering",
  CreatePersonas: "/ai/personas/create",
  /**
   * eg. /ai/personas/{persona_id}
   */
  updatePersonas: "/ai/personas",

  BulkUpdateStatusPersonas: "/ai/personas/bulk-status-update",

  /**
   * eg. /ai/personas/{persona_id}
   */
  deletePersona: "/ai/personas",

  /**
   * eg. /ai/personas/bulk-delete
   */
  deleteMultiplePersonas: "/ai/personas/bulk-delete",

  downloadPersona: "/ai/personas/download-personas",

  getPersonaById: "/ai/personas",

  getPersonasList: "/ai/personas/list",

  getPersonasStats: "/ai/personas/stats",

  getPersonaLib: "/ai/personas/persona-lib",

  generatePersonasLLM: "/ai/personas/generate-personas-llm",
} as const;

export const metadataApiEndPoint = {
  uploadMetadata: "/ai/metadata/upload",
  getMetadataList: "/ai/metadata/list",
} as const;

export const authApiEndPoint = {
  login: "/auth/login",
  refreshToken: "/auth/refresh",
  logout: "/auth/logout",
  getUserInfo: "/auth/me",
  tokenUsage: "/auth/token-usage",
  wishlist: "/auth/wishlist",
} as const;

export const productApiEndPoint = {
  createProduct: "/products/",
  getProducts: "/products/",
  getProductById: "/products",
  getMyProducts: "/products/user/me",
  updateProduct: "/products",
  deleteProduct: "/products",
  uploadProductImage: "/ocr/extract",
} as const;

export const simulationApiEndPoint = {
  runSimulation: "/simulation/run/new",
  getSimulationHistory: "/simulation/history",
  getSimulationById: "/simulation-new/simulation/job",
  getAvailableModels: "/simulation/models",
  getJobStatus: "/simulation/job",
} as const;

export const abTestingApiEndPoint = {
  runAbTest: "/ab-testing/run",
  getAbTestHistory: "/ab-testing/history",
  getAbTestHistoryById: "/ab-testing",
} as const;

export const mediaSimulationApiEndPoint = {
  runMediaSimulation: "/media/run/new",
  getMediaSimulationById: "/media",
  getMediaHistory: "/media/history",
  getJobStatus: "/media/job",
} as const;

export const jobsApiEndPoint = {
  list: "/simulation-new/jobs/list",
  getById: "/simulation-new/simulation/job",
} as const;

export const chatbotApiEndPoint = {
  createSession: "/ai/persona-chat/start",
  chatStream: "/ai/persona-chat/chat/stream",
  getSessionById: "/ai/persona-chat/chat",
  answerQuestion: "/ai/persona-chat/answer",
  getChatHistory: "/ai/persona-chat/history",
} as const;

export const subscriptionApiEndPoint = {
  getSubscriptionDetails: "/subscription/plans",
  checkout: "/subscription/checkout",
  creditsTopup: "/subscription/credits/topup",
} as const;
