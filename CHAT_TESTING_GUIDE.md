# Chat Implementation Testing Guide

This guide covers testing the complete chat implementation including channels, messages, reactions, replies, and direct messaging.

## Test Files Overview

### 1. **Unit Tests: Chat Service** (`src/services/resources/__tests__/chat.service.test.ts`)
Tests the `ChatService` class in isolation using mocked Axios responses.

**Coverage:**
- Channel operations (CRUD, followers, members)
- Message operations (CRUD, pagination)
- Direct messages
- Message reactions
- Message replies
- User operations
- Error handling for all operations

**Running:**
```bash
npm test -- chat.service.test.ts
```

### 2. **Unit Tests: Tool Handlers** (`src/tools/__tests__/chat.tools.test.ts`)
Tests individual tool handlers including input validation and response formatting.

**Coverage:**
- 17 tool handlers (channels, messages, reactions, replies, users)
- Input validation for all required parameters
- Optional parameter handling
- Response format validation
- Error handling and error messages

**Running:**
```bash
npm test -- chat.tools.test.ts
```

### 3. **Integration Tests** (`src/__tests__/chat.integration.test.ts`)
Tests against real ClickUp API endpoints (requires valid API token).

**Setup:**
```bash
export CLICKUP_API_TOKEN=your_token
export CLICKUP_TEST_WORKSPACE_ID=your_workspace_id
export CLICKUP_TEST_USER_ID=your_user_id  # Optional
```

**Coverage:**
- Real API calls for all chat operations
- End-to-end workflow testing
- Automatic cleanup of test data

**Running:**
```bash
npm test -- chat.integration.test.ts -- --runInBand
```

### 4. **Test Utilities** (`src/__tests__/test.utils.ts`)
Reusable test helpers, mock data generators, and assertion functions.

**Includes:**
- Mock data generators (channels, messages, reactions, users)
- Mock service factory
- Response builders
- Assertion helpers

## Test Execution

### Run All Chat Tests
```bash
npm test -- chat
```

### Run Specific Test Suite
```bash
npm test -- chat.service.test.ts
npm test -- chat.tools.test.ts
npm test -- chat.integration.test.ts
```

### Run Tests with Coverage
```bash
npm test -- --coverage --testPathPattern=chat
```

### Run Tests in Watch Mode
```bash
npm test -- --watch chat.tools.test.ts
```

## Test Structure

Each test file follows this pattern:

```typescript
describe("Feature Category", () => {
  // Setup/teardown
  beforeEach(() => { /* setup */ });
  afterEach(() => { /* cleanup */ });

  // Test suites
  describe("Specific Operation", () => {
    it("should do something successfully", async () => {
      // Arrange
      const input = { /* test data */ };
      const expected = { /* expected result */ };

      // Act
      const result = await handler(input);

      // Assert
      expect(result).toEqual(expected);
    });

    it("should handle error cases", async () => {
      // Test error handling
    });
  });
});
```

## Key Test Scenarios

### Channel Operations
```typescript
✓ Get all channels
✓ Create new channel (with optional parameters)
✓ Get specific channel
✓ Update channel (name, description, privacy)
✓ Delete channel
✓ Get channel members
✓ Get channel followers
✓ Error handling (missing params, API errors)
```

### Message Operations
```typescript
✓ Send message to channel
✓ Retrieve messages (with pagination)
✓ Update message text
✓ Delete message
✓ Handle special characters in messages
✓ Error handling (missing channel, invalid text)
```

### Reaction Operations
```typescript
✓ Add emoji reaction to message
✓ Get all reactions on message
✓ Remove reaction
✓ Handle invalid emoji formats
✓ Error handling (missing message)
```

### Reply Operations
```typescript
✓ Create threaded reply
✓ Get replies with pagination
✓ Handle reply context
✓ Error handling (missing parent message)
```

### Direct Messages
```typescript
✓ Send DM to user
✓ Handle user lookup
✓ Error handling (invalid user)
```

## Input Validation Tests

All handlers validate:
- **Required parameters**: Must be present and correct type
- **Optional parameters**: Handled gracefully when missing
- **Type checking**: Strings are strings, numbers are numbers
- **Edge cases**: Empty strings, zero values, special characters

Example:
```typescript
it("should throw error on missing workspace_id", async () => {
  await expect(
    handleGetChannels(mockClickUpService, {})
  ).rejects.toThrow("Workspace ID is required and must be a string.");
});

it("should throw error on invalid workspace_id type", async () => {
  await expect(
    handleGetChannels(mockClickUpService, { workspace_id: 123 })
  ).rejects.toThrow("Workspace ID is required and must be a string.");
});
```

## Response Format Validation

All responses follow this structure:
```typescript
{
  content: [
    {
      type: "text",
      text: "JSON stringified response"
    }
  ],
  structuredContent: {
    // Parsed response object
  }
}
```

Tests verify:
- `content` array is present
- First element has type and text
- Text is valid JSON
- `structuredContent` contains parsed data

## Mock Data Examples

### Mock Channel
```typescript
{
  id: "ch-abc123",
  name: "general",
  description: "General discussion",
  private: false,
  workspace_id: "ws-123"
}
```

### Mock Message
```typescript
{
  id: "msg-xyz789",
  text: "Hello world",
  channel_id: "ch-abc123",
  user_id: "user-123",
  created: 1234567890
}
```

### Mock Reaction
```typescript
{
  id: "reaction-123",
  emoji: "thumbsup",
  user_id: "user-123",
  message_id: "msg-xyz789",
  created: 1234567890
}
```

## Error Scenarios

### Common Errors Tested
- Missing required parameters
- Invalid parameter types
- API endpoint errors (400, 401, 403, 404, 500)
- Network errors
- Axios request failures
- Generic error handling

### Example Error Test
```typescript
it("should handle Axios errors", async () => {
  const axiosError = {
    isAxiosError: true,
    message: "Network error",
    response: { status: 500, data: { error: "Internal error" } },
    config: { url: "/chat/channels" }
  };
  mockAxiosInstance.get.mockRejectedValue(axiosError);

  await expect(chatService.getChannels(workspaceId))
    .rejects.toThrow("Failed to get channels from ClickUp");
});
```

## Mocking Strategy

### Service Layer Tests
- Mock Axios with specific responses
- Test all code paths (success, error, edge cases)
- Verify correct API endpoints are called
- Check parameter passing

### Tool Handler Tests
- Mock entire ChatService
- Test input validation independently
- Test response formatting
- Test error propagation

### Integration Tests
- Use real API calls
- Provide test cleanup
- Skip when API token unavailable
- Document required environment setup

## Running Specific Test Patterns

### Test by Handler Name
```bash
npm test -- --testNamePattern="handleCreateChannel"
```

### Test by Feature
```bash
npm test -- --testNamePattern="Channel Operations"
```

### Test All Error Cases
```bash
npm test -- --testNamePattern="error|Error"
```

### Test Specific Scenario
```bash
npm test -- --testNamePattern="should create a message successfully"
```

## Test Coverage Goals

| Component | Target | Current |
|-----------|--------|---------|
| Service Methods | 100% | - |
| Tool Handlers | 100% | - |
| Input Validation | 100% | - |
| Error Handling | 100% | - |
| Response Format | 100% | - |

## Continuous Integration

### Pre-commit Hook
```bash
npm test -- --testPathPattern=chat --coverage --bail
```

### CI Pipeline
```yaml
test:
  - npm test -- chat.service.test.ts --coverage
  - npm test -- chat.tools.test.ts --coverage
  - npm test -- chat.integration.test.ts --runInBand
```

## Troubleshooting

### Tests Fail with "Cannot find module"
```bash
npm install
npm run build
```

### Integration Tests Skip
```bash
# Verify environment variables
echo $CLICKUP_API_TOKEN
echo $CLICKUP_TEST_WORKSPACE_ID
```

### Axios Mocking Not Working
- Ensure mock is set up before service creation
- Verify jest.mock is at top of file
- Check mock implementation matches Axios API

### Timeout Errors
```bash
# Increase Jest timeout for integration tests
npm test -- --testTimeout=30000
```

## Best Practices

1. **Test Names**: Use descriptive names explaining what is tested
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Single Responsibility**: One assertion per test where possible
4. **DRY**: Use test utilities and mock generators
5. **Cleanup**: Always clean up test data
6. **Isolation**: Tests should not depend on each other
7. **Mocking**: Mock external dependencies consistently

## Adding New Tests

When adding new chat features:

1. Create service method tests in `chat.service.test.ts`
2. Create tool handler tests in `chat.tools.test.ts`
3. Add integration test if applicable
4. Update mock generators in `test.utils.ts`
5. Document test scenario
6. Run full test suite: `npm test -- chat`

## Performance Benchmarks

Expected test execution times:
- Unit tests: < 2 seconds
- Integration tests: < 30 seconds (with API)
- Full test suite: < 35 seconds

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [ClickUp API Docs](https://clickup.com/api)
- [Axios Documentation](https://axios-http.com/)
