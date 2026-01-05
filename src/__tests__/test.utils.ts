/**
 * Test Utilities for Chat Implementation
 */

import { AxiosInstance } from "axios";

/**
 * Mock data generators for testing
 */
export const mockDataGenerators = {
  /**
   * Generate mock channel data
   */
  channel: (overrides: any = {}) => ({
    id: `ch-${Math.random().toString(36).substr(2, 9)}`,
    name: "test-channel",
    description: "Test channel",
    private: false,
    workspace_id: "ws-123",
    created: Date.now(),
    ...overrides,
  }),

  /**
   * Generate mock message data
   */
  message: (overrides: any = {}) => ({
    id: `msg-${Math.random().toString(36).substr(2, 9)}`,
    text: "Test message",
    channel_id: "ch-123",
    user_id: "user-123",
    created: Date.now(),
    ...overrides,
  }),

  /**
   * Generate mock reaction data
   */
  reaction: (overrides: any = {}) => ({
    id: `reaction-${Math.random().toString(36).substr(2, 9)}`,
    emoji: "thumbsup",
    user_id: "user-123",
    message_id: "msg-123",
    created: Date.now(),
    ...overrides,
  }),

  /**
   * Generate mock reply data
   */
  reply: (overrides: any = {}) => ({
    id: `reply-${Math.random().toString(36).substr(2, 9)}`,
    text: "Great idea!",
    user_id: "user-123",
    message_id: "msg-123",
    created: Date.now(),
    ...overrides,
  }),

  /**
   * Generate mock user data
   */
  user: (overrides: any = {}) => ({
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    name: "Test User",
    email: "test@example.com",
    status: "active",
    ...overrides,
  }),

  /**
   * Generate mock follower data
   */
  follower: (overrides: any = {}) => ({
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    name: "Follower Name",
    profile_picture: null,
    ...overrides,
  }),
};

/**
 * Mock service factory
 */
export const createMockClickUpService = () => ({
  chatService: {
    getChannels: jest.fn(),
    createChannel: jest.fn(),
    getChannel: jest.fn(),
    updateChannel: jest.fn(),
    deleteChannel: jest.fn(),
    getChannelFollowers: jest.fn(),
    getChannelMembers: jest.fn(),
    createMessage: jest.fn(),
    getMessages: jest.fn(),
    updateMessage: jest.fn(),
    deleteMessage: jest.fn(),
    createDirectMessage: jest.fn(),
    createMessageReaction: jest.fn(),
    getMessageReactions: jest.fn(),
    deleteMessageReaction: jest.fn(),
    createReply: jest.fn(),
    getReplies: jest.fn(),
    getMentionableUsers: jest.fn(),
  },
});

/**
 * Mock Axios instance factory
 */
export const createMockAxiosInstance = (): jest.Mocked<AxiosInstance> => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  head: jest.fn(),
  options: jest.fn(),
  request: jest.fn(),
  getUri: jest.fn(),
  defaults: {} as any,
  interceptors: {} as any,
});

/**
 * Assert helpers
 */
export const asserts = {
  /**
   * Verify valid MCP tool response format
   */
  isValidToolResponse: (response: any) => {
    expect(response).toHaveProperty("content");
    expect(response).toHaveProperty("structuredContent");
    expect(Array.isArray(response.content)).toBe(true);
    expect(response.content[0]).toHaveProperty("type", "text");
    expect(response.content[0]).toHaveProperty("text");
    expect(typeof response.content[0].text).toBe("string");
  },

  /**
   * Verify valid channel object
   */
  isValidChannel: (channel: any) => {
    expect(channel).toHaveProperty("id");
    expect(channel).toHaveProperty("name");
    expect(typeof channel.id).toBe("string");
    expect(typeof channel.name).toBe("string");
  },

  /**
   * Verify valid message object
   */
  isValidMessage: (message: any) => {
    expect(message).toHaveProperty("id");
    expect(message).toHaveProperty("text");
    expect(typeof message.id).toBe("string");
    expect(typeof message.text).toBe("string");
  },

  /**
   * Verify valid reaction object
   */
  isValidReaction: (reaction: any) => {
    expect(reaction).toHaveProperty("id");
    expect(reaction).toHaveProperty("emoji");
    expect(typeof reaction.id).toBe("string");
    expect(typeof reaction.emoji).toBe("string");
  },

  /**
   * Verify API URL pattern
   */
  isValidApiUrl: (url: string, pattern: string) => {
    const regex = new RegExp(pattern);
    expect(url).toMatch(regex);
  },
};

/**
 * Test data scenarios
 */
export const testScenarios = {
  /**
   * Standard channel creation scenario
   */
  channelCreation: {
    input: {
      workspace_id: "ws-123",
      name: "new-channel",
      description: "A new channel",
      private: false,
    },
    expected: {
      success: true,
      hasId: true,
      hasName: true,
    },
  },

  /**
   * Message creation scenario
   */
  messageCreation: {
    input: {
      workspace_id: "ws-123",
      channel_id: "ch-456",
      text: "Hello world",
    },
    expected: {
      success: true,
      hasId: true,
      hasText: true,
    },
  },

  /**
   * Reaction scenario
   */
  reactionCreation: {
    input: {
      workspace_id: "ws-123",
      channel_id: "ch-456",
      message_id: "msg-789",
      emoji: "thumbsup",
    },
    expected: {
      success: true,
      hasId: true,
      hasEmoji: true,
    },
  },

  /**
   * Error scenarios
   */
  errors: {
    missingRequiredParam: {
      error: "required and must be a string",
      statusCode: 400,
    },
    invalidParam: {
      error: "must be a string",
      statusCode: 400,
    },
    apiError: {
      error: "Failed to",
      statusCode: 500,
    },
    notFound: {
      error: "not found",
      statusCode: 404,
    },
  },
};

/**
 * Batch test runner helper
 */
export const runBatchTests = async (
  testCases: Array<{
    name: string;
    input: any;
    expected: any;
    handler: (input: any) => Promise<any>;
  }>,
) => {
  const results = [];

  for (const testCase of testCases) {
    try {
      const result = await testCase.handler(testCase.input);
      results.push({
        name: testCase.name,
        status: "passed",
        result,
      });
    } catch (error) {
      results.push({
        name: testCase.name,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
};

/**
 * Response builder for mocking
 */
export const buildMockResponse = {
  /**
   * Build successful channel list response
   */
  channelList: (count: number = 3) => ({
    channels: Array.from({ length: count }, (_, i) =>
      mockDataGenerators.channel({ name: `channel-${i + 1}` }),
    ),
  }),

  /**
   * Build successful message list response
   */
  messageList: (count: number = 5) => ({
    messages: Array.from({ length: count }, (_, i) =>
      mockDataGenerators.message({ text: `Message ${i + 1}` }),
    ),
  }),

  /**
   * Build successful reaction list response
   */
  reactionList: (count: number = 3) => ({
    reactions: Array.from({ length: count }, (_, i) =>
      mockDataGenerators.reaction({
        emoji: ["thumbsup", "heart", "laughing"][i % 3],
      }),
    ),
  }),

  /**
   * Build successful user list response
   */
  userList: (count: number = 5) => ({
    users: Array.from({ length: count }, (_, i) =>
      mockDataGenerators.user({ name: `User ${i + 1}` }),
    ),
  }),

  /**
   * Build error response
   */
  error: (message: string, code: number = 500) => ({
    error: message,
    status_code: code,
  }),
};
