/**
 * Chat Integration Tests
 *
 * These tests are designed to work with real ClickUp API endpoints.
 * To run these tests, set the environment variable:
 * CLICKUP_API_TOKEN=your_token
 * CLICKUP_TEST_WORKSPACE_ID=your_workspace_id
 *
 * Run with: npm test -- --testNamePattern="Chat Integration" --runInBand
 */

import axios, { AxiosInstance } from "axios";
import { ChatService } from "../services/resources/chat.service";

describe("Chat Integration Tests", () => {
  let chatService: ChatService;
  let workspaceId: string;
  let channelId: string;
  let messageId: string;
  let userId: string;

  const isIntegrationTest = !!process.env.CLICKUP_API_TOKEN;

  beforeAll(() => {
    if (!isIntegrationTest) {
      console.log(
        "Skipping integration tests. Set CLICKUP_API_TOKEN to enable.",
      );
      return;
    }

    const axiosInstance = axios.create({
      baseURL: "https://api.clickup.com",
      headers: {
        Authorization: process.env.CLICKUP_API_TOKEN,
        "Content-Type": "application/json",
      },
    });

    chatService = new ChatService(axiosInstance);
    workspaceId = process.env.CLICKUP_TEST_WORKSPACE_ID || "";
    userId = process.env.CLICKUP_TEST_USER_ID || "";
  });

  (isIntegrationTest ? describe : describe.skip)("Chat Channel Operations", () => {
    it("should get all channels in workspace", async () => {
      const result = await chatService.getChannels(workspaceId);

      expect(result).toBeDefined();
      expect(result.channels).toBeDefined();
      expect(Array.isArray(result.channels)).toBe(true);
    });

    it("should create a new chat channel", async () => {
      const channelData = {
        name: `test-channel-${Date.now()}`,
        description: "Test channel for integration testing",
        private: false,
      };

      const result = await chatService.createChannel(workspaceId, channelData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(channelData.name);

      // Store for later tests
      channelId = result.id;
    });

    it("should retrieve a specific channel", async () => {
      if (!channelId) {
        console.log("Skipping: No channel ID available");
        return;
      }

      const result = await chatService.getChannel(workspaceId, channelId);

      expect(result).toBeDefined();
      expect(result.id).toBe(channelId);
    });

    it("should update a channel", async () => {
      if (!channelId) {
        console.log("Skipping: No channel ID available");
        return;
      }

      const updateData = {
        name: `updated-channel-${Date.now()}`,
        description: "Updated description",
      };

      const result = await chatService.updateChannel(
        workspaceId,
        channelId,
        updateData,
      );

      expect(result).toBeDefined();
      expect(result.name).toBe(updateData.name);
    });

    it("should get channel members", async () => {
      if (!channelId) {
        console.log("Skipping: No channel ID available");
        return;
      }

      const result = await chatService.getChannelMembers(workspaceId, channelId);

      expect(result).toBeDefined();
      expect(result.members).toBeDefined();
      expect(Array.isArray(result.members)).toBe(true);
    });

    it("should get channel followers", async () => {
      if (!channelId) {
        console.log("Skipping: No channel ID available");
        return;
      }

      const result = await chatService.getChannelFollowers(
        workspaceId,
        channelId,
      );

      expect(result).toBeDefined();
      expect(result.followers).toBeDefined();
      expect(Array.isArray(result.followers)).toBe(true);
    });
  });

  (isIntegrationTest ? describe : describe.skip)("Chat Message Operations", () => {
    beforeEach(async () => {
      // Ensure we have a test channel
      if (!channelId) {
        const result = await chatService.createChannel(workspaceId, {
          name: `test-channel-${Date.now()}`,
          private: false,
        });
        channelId = result.id;
      }
    });

    it("should create a message", async () => {
      const messageData = { text: `Test message at ${new Date().toISOString()}` };

      const result = await chatService.createMessage(
        workspaceId,
        channelId,
        messageData,
      );

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.text).toBe(messageData.text);

      messageId = result.id;
    });

    it("should retrieve messages", async () => {
      const result = await chatService.getMessages(workspaceId, channelId, {
        limit: 10,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(result.messages).toBeDefined();
      expect(Array.isArray(result.messages)).toBe(true);
    });

    it("should update a message", async () => {
      if (!messageId) {
        console.log("Skipping: No message ID available");
        return;
      }

      const updateData = { text: "Updated message text" };

      const result = await chatService.updateMessage(
        workspaceId,
        channelId,
        messageId,
        updateData,
      );

      expect(result).toBeDefined();
      expect(result.text).toBe(updateData.text);
    });

    it("should create message reactions", async () => {
      if (!messageId) {
        console.log("Skipping: No message ID available");
        return;
      }

      const reactionData = { emoji: "thumbsup" };

      const result = await chatService.createMessageReaction(
        workspaceId,
        channelId,
        messageId,
        reactionData,
      );

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it("should get message reactions", async () => {
      if (!messageId) {
        console.log("Skipping: No message ID available");
        return;
      }

      const result = await chatService.getMessageReactions(
        workspaceId,
        channelId,
        messageId,
      );

      expect(result).toBeDefined();
      expect(result.reactions).toBeDefined();
      expect(Array.isArray(result.reactions)).toBe(true);
    });

    it("should create a reply", async () => {
      if (!messageId) {
        console.log("Skipping: No message ID available");
        return;
      }

      const replyData = { text: "Great idea!" };

      const result = await chatService.createReply(
        workspaceId,
        channelId,
        messageId,
        replyData,
      );

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it("should get replies", async () => {
      if (!messageId) {
        console.log("Skipping: No message ID available");
        return;
      }

      const result = await chatService.getReplies(
        workspaceId,
        channelId,
        messageId,
        { limit: 5, offset: 0 },
      );

      expect(result).toBeDefined();
      expect(result.replies).toBeDefined();
      expect(Array.isArray(result.replies)).toBe(true);
    });
  });

  (isIntegrationTest ? describe : describe.skip)("Direct Message Operations", () => {
    it("should create a direct message", async () => {
      if (!userId) {
        console.log("Skipping: No test user ID provided");
        return;
      }

      const dmData = {
        user_id: userId,
        text: `Test DM at ${new Date().toISOString()}`,
      };

      const result = await chatService.createDirectMessage(workspaceId, dmData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });

  (isIntegrationTest ? describe : describe.skip)("User Operations", () => {
    it("should get mentionable users", async () => {
      const result = await chatService.getMentionableUsers(workspaceId);

      expect(result).toBeDefined();
      expect(result.users).toBeDefined();
      expect(Array.isArray(result.users)).toBe(true);
    });
  });

  afterAll(async () => {
    if (!isIntegrationTest) return;

    // Cleanup: Delete test channel if it was created
    if (channelId) {
      try {
        await chatService.deleteChannel(workspaceId, channelId);
        console.log(`Cleaned up test channel: ${channelId}`);
      } catch (error) {
        console.error(`Failed to cleanup channel: ${error}`);
      }
    }
  });
});
