import axios from "axios";
import { ChatService } from "../chat.service";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ChatService", () => {
  let chatService: ChatService;
  let mockAxiosInstance: jest.Mocked<any>;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    chatService = new ChatService(mockAxiosInstance);
  });

  describe("Channel Operations", () => {
    const workspaceId = "test-workspace-123";
    const channelId = "test-channel-456";

    describe("getChannels", () => {
      it("should retrieve all channels successfully", async () => {
        const mockChannels = {
          channels: [
            { id: "ch1", name: "general" },
            { id: "ch2", name: "random" },
          ],
        };
        mockAxiosInstance.get.mockResolvedValue({ data: mockChannels });

        const result = await chatService.getChannels(workspaceId);

        expect(result).toEqual(mockChannels);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels`,
        );
      });

      it("should handle Axios errors", async () => {
        const axiosError = {
          isAxiosError: true,
          message: "Network error",
          response: { status: 500, data: { error: "Internal error" } },
          config: { url: "/chat/channels" },
        };
        mockAxiosInstance.get.mockRejectedValue(axiosError);

        await expect(chatService.getChannels(workspaceId)).rejects.toThrow(
          "Failed to get channels from ClickUp",
        );
      });

      it("should handle generic errors", async () => {
        mockAxiosInstance.get.mockRejectedValue(new Error("Generic error"));

        await expect(chatService.getChannels(workspaceId)).rejects.toThrow(
          "Failed to get channels from ClickUp",
        );
      });
    });

    describe("createChannel", () => {
      it("should create a channel successfully", async () => {
        const channelData = {
          name: "new-channel",
          description: "A new channel",
          private: false,
        };
        const mockResponse = {
          id: channelId,
          ...channelData,
        };
        mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

        const result = await chatService.createChannel(workspaceId, channelData);

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels`,
          channelData,
        );
      });

      it("should handle creation errors", async () => {
        mockAxiosInstance.post.mockRejectedValue(
          new Error("Creation failed"),
        );

        await expect(
          chatService.createChannel(workspaceId, { name: "test" }),
        ).rejects.toThrow("Failed to create channel in ClickUp");
      });
    });

    describe("getChannel", () => {
      it("should retrieve a specific channel", async () => {
        const mockChannel = { id: channelId, name: "general" };
        mockAxiosInstance.get.mockResolvedValue({ data: mockChannel });

        const result = await chatService.getChannel(workspaceId, channelId);

        expect(result).toEqual(mockChannel);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}`,
        );
      });
    });

    describe("updateChannel", () => {
      it("should update a channel successfully", async () => {
        const updateData = { name: "updated-channel" };
        const mockResponse = { id: channelId, ...updateData };
        mockAxiosInstance.put.mockResolvedValue({ data: mockResponse });

        const result = await chatService.updateChannel(
          workspaceId,
          channelId,
          updateData,
        );

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.put).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}`,
          updateData,
        );
      });
    });

    describe("deleteChannel", () => {
      it("should delete a channel successfully", async () => {
        const mockResponse = { success: true };
        mockAxiosInstance.delete.mockResolvedValue({ data: mockResponse });

        const result = await chatService.deleteChannel(workspaceId, channelId);

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}`,
        );
      });
    });

    describe("getChannelFollowers", () => {
      it("should retrieve channel followers", async () => {
        const mockFollowers = {
          followers: [{ id: "user1", name: "John" }],
        };
        mockAxiosInstance.get.mockResolvedValue({ data: mockFollowers });

        const result = await chatService.getChannelFollowers(
          workspaceId,
          channelId,
        );

        expect(result).toEqual(mockFollowers);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/followers`,
        );
      });
    });

    describe("getChannelMembers", () => {
      it("should retrieve channel members", async () => {
        const mockMembers = {
          members: [{ id: "user1", name: "John" }],
        };
        mockAxiosInstance.get.mockResolvedValue({ data: mockMembers });

        const result = await chatService.getChannelMembers(
          workspaceId,
          channelId,
        );

        expect(result).toEqual(mockMembers);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/members`,
        );
      });
    });
  });

  describe("Message Operations", () => {
    const workspaceId = "test-workspace-123";
    const channelId = "test-channel-456";
    const messageId = "test-message-789";

    describe("createMessage", () => {
      it("should create a message successfully", async () => {
        const messageData = { text: "Hello world" };
        const mockResponse = {
          id: messageId,
          ...messageData,
          created: 1234567890,
        };
        mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

        const result = await chatService.createMessage(
          workspaceId,
          channelId,
          messageData,
        );

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages`,
          messageData,
        );
      });

      it("should handle message creation errors", async () => {
        mockAxiosInstance.post.mockRejectedValue(
          new Error("Message creation failed"),
        );

        await expect(
          chatService.createMessage(workspaceId, channelId, {
            text: "test",
          }),
        ).rejects.toThrow("Failed to create message in ClickUp");
      });
    });

    describe("getMessages", () => {
      it("should retrieve messages with pagination", async () => {
        const mockMessages = {
          messages: [
            { id: messageId, text: "Hello" },
            { id: "msg2", text: "World" },
          ],
        };
        mockAxiosInstance.get.mockResolvedValue({ data: mockMessages });

        const result = await chatService.getMessages(workspaceId, channelId, {
          limit: 10,
          offset: 0,
        });

        expect(result).toEqual(mockMessages);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages`,
          { params: { limit: 10, offset: 0 } },
        );
      });

      it("should retrieve messages without pagination", async () => {
        const mockMessages = { messages: [{ id: messageId, text: "Hello" }] };
        mockAxiosInstance.get.mockResolvedValue({ data: mockMessages });

        const result = await chatService.getMessages(workspaceId, channelId);

        expect(result).toEqual(mockMessages);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages`,
          { params: undefined },
        );
      });
    });

    describe("updateMessage", () => {
      it("should update a message successfully", async () => {
        const updateData = { text: "Updated message" };
        const mockResponse = { id: messageId, ...updateData };
        mockAxiosInstance.put.mockResolvedValue({ data: mockResponse });

        const result = await chatService.updateMessage(
          workspaceId,
          channelId,
          messageId,
          updateData,
        );

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.put).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}`,
          updateData,
        );
      });
    });

    describe("deleteMessage", () => {
      it("should delete a message successfully", async () => {
        const mockResponse = { success: true };
        mockAxiosInstance.delete.mockResolvedValue({ data: mockResponse });

        const result = await chatService.deleteMessage(
          workspaceId,
          channelId,
          messageId,
        );

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}`,
        );
      });
    });
  });

  describe("Direct Message Operations", () => {
    const workspaceId = "test-workspace-123";

    describe("createDirectMessage", () => {
      it("should create a direct message successfully", async () => {
        const dmData = { user_id: "user123", text: "Hello" };
        const mockResponse = { id: "dm123", ...dmData };
        mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

        const result = await chatService.createDirectMessage(
          workspaceId,
          dmData,
        );

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/direct_messages`,
          dmData,
        );
      });

      it("should handle direct message creation errors", async () => {
        mockAxiosInstance.post.mockRejectedValue(
          new Error("DM creation failed"),
        );

        await expect(
          chatService.createDirectMessage(workspaceId, {
            user_id: "user123",
            text: "test",
          }),
        ).rejects.toThrow("Failed to create direct message in ClickUp");
      });
    });
  });

  describe("Message Reaction Operations", () => {
    const workspaceId = "test-workspace-123";
    const channelId = "test-channel-456";
    const messageId = "test-message-789";
    const reactionId = "reaction-123";

    describe("createMessageReaction", () => {
      it("should create a message reaction successfully", async () => {
        const reactionData = { emoji: "thumbsup" };
        const mockResponse = { id: reactionId, ...reactionData };
        mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

        const result = await chatService.createMessageReaction(
          workspaceId,
          channelId,
          messageId,
          reactionData,
        );

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}/reactions`,
          reactionData,
        );
      });
    });

    describe("getMessageReactions", () => {
      it("should retrieve message reactions", async () => {
        const mockReactions = {
          reactions: [{ id: reactionId, emoji: "thumbsup", user_id: "user1" }],
        };
        mockAxiosInstance.get.mockResolvedValue({ data: mockReactions });

        const result = await chatService.getMessageReactions(
          workspaceId,
          channelId,
          messageId,
        );

        expect(result).toEqual(mockReactions);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}/reactions`,
        );
      });
    });

    describe("deleteMessageReaction", () => {
      it("should delete a message reaction successfully", async () => {
        const mockResponse = { success: true };
        mockAxiosInstance.delete.mockResolvedValue({ data: mockResponse });

        const result = await chatService.deleteMessageReaction(
          workspaceId,
          channelId,
          messageId,
          reactionId,
        );

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}/reactions/${reactionId}`,
        );
      });
    });
  });

  describe("Reply Operations", () => {
    const workspaceId = "test-workspace-123";
    const channelId = "test-channel-456";
    const messageId = "test-message-789";

    describe("createReply", () => {
      it("should create a reply successfully", async () => {
        const replyData = { text: "Great idea!" };
        const mockResponse = { id: "reply123", ...replyData };
        mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

        const result = await chatService.createReply(
          workspaceId,
          channelId,
          messageId,
          replyData,
        );

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}/replies`,
          replyData,
        );
      });
    });

    describe("getReplies", () => {
      it("should retrieve replies with pagination", async () => {
        const mockReplies = {
          replies: [
            { id: "reply1", text: "Great!" },
            { id: "reply2", text: "Agreed!" },
          ],
        };
        mockAxiosInstance.get.mockResolvedValue({ data: mockReplies });

        const result = await chatService.getReplies(
          workspaceId,
          channelId,
          messageId,
          { limit: 5, offset: 0 },
        );

        expect(result).toEqual(mockReplies);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}/replies`,
          { params: { limit: 5, offset: 0 } },
        );
      });
    });
  });

  describe("User Operations", () => {
    const workspaceId = "test-workspace-123";

    describe("getMentionableUsers", () => {
      it("should retrieve mentionable users", async () => {
        const mockUsers = {
          users: [
            { id: "user1", name: "John" },
            { id: "user2", name: "Jane" },
          ],
        };
        mockAxiosInstance.get.mockResolvedValue({ data: mockUsers });

        const result = await chatService.getMentionableUsers(workspaceId);

        expect(result).toEqual(mockUsers);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          `/v3/workspaces/${workspaceId}/chat/users`,
        );
      });

      it("should handle retrieval errors", async () => {
        mockAxiosInstance.get.mockRejectedValue(
          new Error("Failed to fetch users"),
        );

        await expect(
          chatService.getMentionableUsers(workspaceId),
        ).rejects.toThrow("Failed to get mentionable users from ClickUp");
      });
    });
  });
});
