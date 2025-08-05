var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { M as MessageTarget, O as OFFSCREEN_MESSAGE_TYPES, S as SendMessageType, a as SemanticSimilarityEngine, B as BACKGROUND_MESSAGE_TYPES } from "./semantic-similarity-engine-D0u7zDKx.js";
let similarityEngine = null;
chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message.target !== MessageTarget.Offscreen) {
      return;
    }
    try {
      switch (message.type) {
        case SendMessageType.SimilarityEngineInit:
        case OFFSCREEN_MESSAGE_TYPES.SIMILARITY_ENGINE_INIT: {
          const initMsg = message;
          console.log("Offscreen: Received similarity engine init message:", message.type);
          handleSimilarityEngineInit(initMsg.config).then(() => sendResponse({ success: true })).catch((error) => sendResponse({ success: false, error: error.message }));
          break;
        }
        case SendMessageType.SimilarityEngineComputeBatch: {
          const computeMsg = message;
          handleComputeSimilarityBatch(computeMsg.pairs, computeMsg.options).then((similarities) => sendResponse({ success: true, similarities })).catch((error) => sendResponse({ success: false, error: error.message }));
          break;
        }
        case OFFSCREEN_MESSAGE_TYPES.SIMILARITY_ENGINE_COMPUTE: {
          const embeddingMsg = message;
          handleGetEmbedding(embeddingMsg.text, embeddingMsg.options).then((embedding) => {
            console.log("Offscreen: Sending embedding response:", {
              length: embedding.length,
              type: typeof embedding,
              constructor: embedding.constructor.name,
              isFloat32Array: embedding instanceof Float32Array,
              firstFewValues: Array.from(embedding.slice(0, 5))
            });
            const embeddingArray = Array.from(embedding);
            console.log("Offscreen: Converted to array:", {
              length: embeddingArray.length,
              type: typeof embeddingArray,
              isArray: Array.isArray(embeddingArray),
              firstFewValues: embeddingArray.slice(0, 5)
            });
            sendResponse({ success: true, embedding: embeddingArray });
          }).catch((error) => sendResponse({ success: false, error: error.message }));
          break;
        }
        case OFFSCREEN_MESSAGE_TYPES.SIMILARITY_ENGINE_BATCH_COMPUTE: {
          const batchMsg = message;
          handleGetEmbeddingsBatch(batchMsg.texts, batchMsg.options).then(
            (embeddings) => sendResponse({
              success: true,
              embeddings: embeddings.map((emb) => Array.from(emb))
            })
          ).catch((error) => sendResponse({ success: false, error: error.message }));
          break;
        }
        case OFFSCREEN_MESSAGE_TYPES.SIMILARITY_ENGINE_STATUS: {
          handleGetEngineStatus().then((status) => sendResponse(__spreadValues({ success: true }, status))).catch((error) => sendResponse({ success: false, error: error.message }));
          break;
        }
        default:
          sendResponse({ error: `Unknown message type: ${message.type}` });
      }
    } catch (error) {
      if (error instanceof Error) {
        sendResponse({ error: error.message });
      } else {
        sendResponse({ error: "Unknown error occurred" });
      }
    }
    return true;
  }
);
let currentModelConfig = null;
function needsReinitialization(newConfig) {
  if (!similarityEngine || !currentModelConfig) {
    return true;
  }
  const keyFields = ["modelPreset", "modelVersion", "modelIdentifier", "dimension"];
  for (const field of keyFields) {
    if (newConfig[field] !== currentModelConfig[field]) {
      console.log(
        `Offscreen: ${field} changed from ${currentModelConfig[field]} to ${newConfig[field]}`
      );
      return true;
    }
  }
  return false;
}
function handleSimilarityEngineInit(config) {
  return __async(this, null, function* () {
    console.log("Offscreen: Initializing semantic similarity engine with config:", config);
    console.log("Offscreen: Config useLocalFiles:", config.useLocalFiles);
    console.log("Offscreen: Config modelPreset:", config.modelPreset);
    console.log("Offscreen: Config modelVersion:", config.modelVersion);
    console.log("Offscreen: Config modelDimension:", config.modelDimension);
    console.log("Offscreen: Config modelIdentifier:", config.modelIdentifier);
    const needsReinit = needsReinitialization(config);
    console.log("Offscreen: Needs reinitialization:", needsReinit);
    if (!needsReinit) {
      console.log("Offscreen: Using existing engine (no changes detected)");
      yield updateModelStatus("ready", 100);
      return;
    }
    if (similarityEngine) {
      console.log("Offscreen: Cleaning up existing engine for model switch...");
      try {
        yield similarityEngine.dispose();
        console.log("Offscreen: Previous engine disposed successfully");
      } catch (error) {
        console.warn("Offscreen: Failed to dispose previous engine:", error);
      }
      similarityEngine = null;
      currentModelConfig = null;
      try {
        console.log("Offscreen: Clearing IndexedDB vector data for model switch...");
        yield clearVectorIndexedDB();
        console.log("Offscreen: IndexedDB vector data cleared successfully");
      } catch (error) {
        console.warn("Offscreen: Failed to clear IndexedDB vector data:", error);
      }
    }
    try {
      yield updateModelStatus("initializing", 10);
      const progressCallback = (progress) => __async(null, null, function* () {
        console.log("Offscreen: Progress update:", progress);
        yield updateModelStatus(progress.status, progress.progress);
      });
      similarityEngine = new SemanticSimilarityEngine(config);
      console.log("Offscreen: Starting engine initialization with progress tracking...");
      if (typeof similarityEngine.initializeWithProgress === "function") {
        yield similarityEngine.initializeWithProgress(progressCallback);
      } else {
        console.log("Offscreen: Using standard initialization (no progress callback support)");
        yield updateModelStatus("downloading", 30);
        yield similarityEngine.initialize();
        yield updateModelStatus("ready", 100);
      }
      currentModelConfig = __spreadValues({}, config);
      console.log("Offscreen: Semantic similarity engine initialized successfully");
    } catch (error) {
      console.error("Offscreen: Failed to initialize semantic similarity engine:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown initialization error";
      const errorType = analyzeErrorType(errorMessage);
      yield updateModelStatus("error", 0, errorMessage, errorType);
      similarityEngine = null;
      currentModelConfig = null;
      throw error;
    }
  });
}
function clearVectorIndexedDB() {
  return __async(this, null, function* () {
    try {
      const dbNames = ["VectorSearchDB", "ContentIndexerDB", "SemanticSimilarityDB"];
      for (const dbName of dbNames) {
        try {
          const deleteRequest = indexedDB.deleteDatabase(dbName);
          yield new Promise((resolve, _reject) => {
            deleteRequest.onsuccess = () => {
              console.log(`Offscreen: Successfully deleted database: ${dbName}`);
              resolve();
            };
            deleteRequest.onerror = () => {
              console.warn(`Offscreen: Failed to delete database: ${dbName}`, deleteRequest.error);
              resolve();
            };
            deleteRequest.onblocked = () => {
              console.warn(`Offscreen: Database deletion blocked: ${dbName}`);
              resolve();
            };
          });
        } catch (error) {
          console.warn(`Offscreen: Error deleting database ${dbName}:`, error);
        }
      }
    } catch (error) {
      console.error("Offscreen: Failed to clear vector IndexedDB:", error);
      throw error;
    }
  });
}
function analyzeErrorType(errorMessage) {
  const message = errorMessage.toLowerCase();
  if (message.includes("network") || message.includes("fetch") || message.includes("timeout") || message.includes("connection") || message.includes("cors") || message.includes("failed to fetch")) {
    return "network";
  }
  if (message.includes("corrupt") || message.includes("invalid") || message.includes("format") || message.includes("parse") || message.includes("decode") || message.includes("onnx")) {
    return "file";
  }
  return "unknown";
}
function updateModelStatus(status, progress, errorMessage, errorType) {
  return __async(this, null, function* () {
    try {
      const modelState = {
        status,
        downloadProgress: progress,
        isDownloading: status === "downloading" || status === "initializing",
        lastUpdated: Date.now(),
        errorMessage: errorMessage || "",
        errorType: errorType || ""
      };
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        yield chrome.storage.local.set({ modelState });
      } else {
        console.log("Offscreen: chrome.storage not available, sending message to background");
        try {
          yield chrome.runtime.sendMessage({
            type: BACKGROUND_MESSAGE_TYPES.UPDATE_MODEL_STATUS,
            modelState
          });
        } catch (messageError) {
          console.error("Offscreen: Failed to send status update message:", messageError);
        }
      }
    } catch (error) {
      console.error("Offscreen: Failed to update model status:", error);
    }
  });
}
function handleComputeSimilarityBatch(_0) {
  return __async(this, arguments, function* (pairs, options = {}) {
    if (!similarityEngine) {
      throw new Error("Similarity engine not initialized. Please reinitialize the engine.");
    }
    console.log(`Offscreen: Computing similarities for ${pairs.length} pairs`);
    const similarities = yield similarityEngine.computeSimilarityBatch(pairs, options);
    console.log("Offscreen: Similarity computation completed");
    return similarities;
  });
}
function handleGetEmbedding(_0) {
  return __async(this, arguments, function* (text, options = {}) {
    if (!similarityEngine) {
      throw new Error("Similarity engine not initialized. Please reinitialize the engine.");
    }
    console.log(`Offscreen: Getting embedding for text: "${text.substring(0, 50)}..."`);
    const embedding = yield similarityEngine.getEmbedding(text, options);
    console.log("Offscreen: Embedding computation completed");
    return embedding;
  });
}
function handleGetEmbeddingsBatch(_0) {
  return __async(this, arguments, function* (texts, options = {}) {
    if (!similarityEngine) {
      throw new Error("Similarity engine not initialized. Please reinitialize the engine.");
    }
    console.log(`Offscreen: Getting embeddings for ${texts.length} texts`);
    const embeddings = yield similarityEngine.getEmbeddingsBatch(texts, options);
    console.log("Offscreen: Batch embedding computation completed");
    return embeddings;
  });
}
function handleGetEngineStatus() {
  return __async(this, null, function* () {
    return {
      isInitialized: !!similarityEngine,
      currentConfig: currentModelConfig
    };
  });
}
console.log("Offscreen: Semantic similarity engine handler loaded");
