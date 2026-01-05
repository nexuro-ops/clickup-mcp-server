const dotenv = require("dotenv");
const path = require("path");

// Preserve the real integration token before unit test setup overwrites it
// This is needed for integration tests to work correctly
const REAL_INTEGRATION_TOKEN = process.env.CLICKUP_PERSONAL_TOKEN;

// Load test environment variables
dotenv.config({
  path: path.resolve(__dirname, "../../.env.test"),
});

// Set up test environment variables
process.env.NODE_ENV = "test";
process.env.PORT = "3001";
process.env.CLICKUP_PERSONAL_TOKEN = "test_token_for_unit_tests";
process.env.ENCRYPTION_KEY = "test-encryption-key-32-chars-long-key";

// Store the real token for integration tests to use
if (REAL_INTEGRATION_TOKEN) {
  process.env.CLICKUP_PERSONAL_TOKEN_INTEGRATION = REAL_INTEGRATION_TOKEN;
}

// Global error handler for unhandled promises
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:", error);
});