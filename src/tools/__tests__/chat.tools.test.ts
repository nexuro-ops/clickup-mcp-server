import {
  handleGetChannels,
  handleCreateChannel,
  handleGetChannel,
  handleUpdateChannel,
  handleDeleteChannel,
  handleGetChannelFollowers,
  handleGetChannelMembers,
  handleCreateMessage,
  handleGetMessages,
  handleUpdateMessage,
  handleDeleteMessage,
  handleCreateDirectMessage,
  handleCreateMessageReaction,
  handleGetMessageReactions,
  handleDeleteMessageReaction,
  handleCreateReply,
  handleGetReplies,
  handleGetMentionableUsers,
} from "../chat.tools";

// Mock the logger
jest.mock("../../logger", () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Chat Tool Handlers", () => {
  let mockClickUpService: any;

  beforeEach(() => {
    mockClickUpService = {
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
    };
  });

  describe("Channel Handlers", () => {
    describe("handleGetChannels", () => {
      it("should retrieve channels successfully", async () => {
        const mockChannels = {
          channels: [
            { id: "ch1", name: "general" },
            { id: "ch2", name: "random" },
          ],
        };
        mockClickUpService.chatService.getChannels.mockResolvedValue(
          mockChannels,
        );

        const result = await handleGetChannels(mockClickUpService, {
          workspace_id: "ws123",
        });

        expect(result.content[0].type).toBe("text");
        expect(result.structuredContent.channels).toEqual(mockChannels.channels);
      });

      it("should throw error on missing workspace_id", async () => {
        await expect(
          handleGetChannels(mockClickUpService, {}),
        ).rejects.toThrow("Workspace ID is required and must be a string.");
      });

      it("should throw error on invalid workspace_id type", async () => {
        await expect(
          handleGetChannels(mockClickUpService, { workspace_id: 123 }),
        ).rejects.toThrow("Workspace ID is required and must be a string.");
      });

      it("should handle service errors", async () => {
        mockClickUpService.chatService.getChannels.mockRejectedValue(
          new Error("API Error"),
        );

        await expect(
          handleGetChannels(mockClickUpService, { workspace_id: "ws123" }),
        ).rejects.toThrow("API Error");
      });
    });

    describe("handleCreateChannel", () => {
      it("should create channel successfully", async () => {
        const mockChannel = { id: "ch1", name: "new-channel" };
        mockClickUpService.chatService.createChannel.mockResolvedValue(
          mockChannel,
        );

        const result = await handleCreateChannel(mockClickUpService, {
          workspace_id: "ws123",
          name: "new-channel",
          description: "A new channel",
          private: false,
        });

        expect(result.structuredContent.channel).toEqual(mockChannel);
        expect(mockClickUpService.chatService.createChannel).toHaveBeenCalledWith(
          "ws123",
          { name: "new-channel", description: "A new channel", private: false },
        );
      });

      it("should throw error on missing workspace_id", async () => {
        await expect(
          handleCreateChannel(mockClickUpService, { name: "test" }),
        ).rejects.toThrow("Workspace ID is required and must be a string.");
      });

      it("should throw error on missing channel name", async () => {
        await expect(
          handleCreateChannel(mockClickUpService, { workspace_id: "ws123" }),
        ).rejects.toThrow("Channel name is required and must be a string.");
      });

      it("should handle optional parameters", async () => {
        const mockChannel = { id: "ch1", name: "channel" };
        mockClickUpService.chatService.createChannel.mockResolvedValue(
          mockChannel,
        );

        await handleCreateChannel(mockClickUpService, {
          workspace_id: "ws123",
          name: "channel",
        });

        expect(mockClickUpService.chatService.createChannel).toHaveBeenCalledWith(
          "ws123",
          { name: "channel" },
        );
      });
    });

    describe("handleGetChannel", () => {
      it("should get channel successfully", async () => {
        const mockChannel = { id: "ch1", name: "general" };
        mockClickUpService.chatService.getChannel.mockResolvedValue(
          mockChannel,
        );

        const result = await handleGetChannel(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
        });

        expect(result.structuredContent.channel).toEqual(mockChannel);
      });

      it("should throw error on missing channel_id", async () => {
        await expect(
          handleGetChannel(mockClickUpService, { workspace_id: "ws123" }),
        ).rejects.toThrow("Channel ID is required and must be a string.");
      });
    });

    describe("handleUpdateChannel", () => {
      it("should update channel successfully", async () => {
        const mockChannel = { id: "ch1", name: "updated-name" };
        mockClickUpService.chatService.updateChannel.mockResolvedValue(
          mockChannel,
        );

        const result = await handleUpdateChannel(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
          name: "updated-name",
        });

        expect(result.structuredContent.channel).toEqual(mockChannel);
      });

      it("should handle partial updates", async () => {
        const mockChannel = { id: "ch1", name: "general", private: true };
        mockClickUpService.chatService.updateChannel.mockResolvedValue(
          mockChannel,
        );

        await handleUpdateChannel(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
          private: true,
        });

        expect(mockClickUpService.chatService.updateChannel).toHaveBeenCalledWith(
          "ws123",
          "ch1",
          { private: true },
        );
      });
    });

    describe("handleDeleteChannel", () => {
      it("should delete channel successfully", async () => {
        mockClickUpService.chatService.deleteChannel.mockResolvedValue({});

        const result = await handleDeleteChannel(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
        });

        expect(result.structuredContent.success).toBe(true);
        expect(result.content[0].text).toContain("deleted successfully");
      });
    });

    describe("handleGetChannelFollowers", () => {
      it("should get followers successfully", async () => {
        const mockFollowers = {
          followers: [{ id: "user1", name: "John" }],
        };
        mockClickUpService.chatService.getChannelFollowers.mockResolvedValue(
          mockFollowers,
        );

        const result = await handleGetChannelFollowers(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
        });

        expect(result.structuredContent.followers).toEqual(mockFollowers.followers);
      });
    });

    describe("handleGetChannelMembers", () => {
      it("should get members successfully", async () => {
        const mockMembers = {
          members: [{ id: "user1", name: "John" }],
        };
        mockClickUpService.chatService.getChannelMembers.mockResolvedValue(
          mockMembers,
        );

        const result = await handleGetChannelMembers(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
        });

        expect(result.structuredContent.members).toEqual(mockMembers.members);
      });
    });
  });

  describe("Message Handlers", () => {
    describe("handleCreateMessage", () => {
      it("should create message successfully", async () => {
        const mockMessage = { id: "msg1", text: "Hello" };
        mockClickUpService.chatService.createMessage.mockResolvedValue(
          mockMessage,
        );

        const result = await handleCreateMessage(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
          text: "Hello",
        });

        expect(result.structuredContent.message).toEqual(mockMessage);
      });

      it("should throw error on missing text", async () => {
        await expect(
          handleCreateMessage(mockClickUpService, {
            workspace_id: "ws123",
            channel_id: "ch1",
          }),
        ).rejects.toThrow("Message text is required and must be a string.");
      });
    });

    describe("handleGetMessages", () => {
      it("should get messages successfully", async () => {
        const mockMessages = {
          messages: [
            { id: "msg1", text: "Hello" },
            { id: "msg2", text: "World" },
          ],
        };
        mockClickUpService.chatService.getMessages.mockResolvedValue(
          mockMessages,
        );

        const result = await handleGetMessages(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
          limit: 10,
          offset: 0,
        });

        expect(result.structuredContent.messages).toEqual(mockMessages.messages);
        expect(mockClickUpService.chatService.getMessages).toHaveBeenCalledWith(
          "ws123",
          "ch1",
          { limit: 10, offset: 0 },
        );
      });

      it("should handle pagination parameters", async () => {
        mockClickUpService.chatService.getMessages.mockResolvedValue({
          messages: [],
        });

        await handleGetMessages(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
        });

        expect(mockClickUpService.chatService.getMessages).toHaveBeenCalledWith(
          "ws123",
          "ch1",
          {},
        );
      });
    });

    describe("handleUpdateMessage", () => {
      it("should update message successfully", async () => {
        const mockMessage = { id: "msg1", text: "Updated" };
        mockClickUpService.chatService.updateMessage.mockResolvedValue(
          mockMessage,
        );

        const result = await handleUpdateMessage(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
          message_id: "msg1",
          text: "Updated",
        });

        expect(result.structuredContent.message).toEqual(mockMessage);
      });
    });

    describe("handleDeleteMessage", () => {
      it("should delete message successfully", async () => {
        mockClickUpService.chatService.deleteMessage.mockResolvedValue({});

        const result = await handleDeleteMessage(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
          message_id: "msg1",
        });

        expect(result.structuredContent.success).toBe(true);
      });
    });
  });

  describe("Direct Message Handler", () => {
    describe("handleCreateDirectMessage", () => {
      it("should create direct message successfully", async () => {
        const mockDM = { id: "dm1", user_id: "user1", text: "Hello" };
        mockClickUpService.chatService.createDirectMessage.mockResolvedValue(
          mockDM,
        );

        const result = await handleCreateDirectMessage(mockClickUpService, {
          workspace_id: "ws123",
          user_id: "user1",
          text: "Hello",
        });

        expect(result.structuredContent.message).toEqual(mockDM);
      });

      it("should throw error on missing user_id", async () => {
        await expect(
          handleCreateDirectMessage(mockClickUpService, {
            workspace_id: "ws123",
            text: "Hello",
          }),
        ).rejects.toThrow("User ID is required and must be a string.");
      });
    });
  });

  describe("Reaction Handlers", () => {
    describe("handleCreateMessageReaction", () => {
      it("should create reaction successfully", async () => {
        const mockReaction = { id: "reaction1", emoji: "thumbsup" };
        mockClickUpService.chatService.createMessageReaction.mockResolvedValue(
          mockReaction,
        );

        const result = await handleCreateMessageReaction(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
          message_id: "msg1",
          emoji: "thumbsup",
        });

        expect(result.structuredContent.reaction).toEqual(mockReaction);
      });

      it("should throw error on missing emoji", async () => {
        await expect(
          handleCreateMessageReaction(mockClickUpService, {
            workspace_id: "ws123",
            channel_id: "ch1",
            message_id: "msg1",
          }),
        ).rejects.toThrow("Emoji is required and must be a string.");
      });
    });

    describe("handleGetMessageReactions", () => {
      it("should get reactions successfully", async () => {
        const mockReactions = {
          reactions: [{ id: "reaction1", emoji: "thumbsup" }],
        };
        mockClickUpService.chatService.getMessageReactions.mockResolvedValue(
          mockReactions,
        );

        const result = await handleGetMessageReactions(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
          message_id: "msg1",
        });

        expect(result.structuredContent.reactions).toEqual(
          mockReactions.reactions,
        );
      });
    });

    describe("handleDeleteMessageReaction", () => {
      it("should delete reaction successfully", async () => {
        mockClickUpService.chatService.deleteMessageReaction.mockResolvedValue(
          {},
        );

        const result = await handleDeleteMessageReaction(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
          message_id: "msg1",
          reaction_id: "reaction1",
        });

        expect(result.structuredContent.success).toBe(true);
      });
    });
  });

  describe("Reply Handlers", () => {
    describe("handleCreateReply", () => {
      it("should create reply successfully", async () => {
        const mockReply = { id: "reply1", text: "Great idea!" };
        mockClickUpService.chatService.createReply.mockResolvedValue(
          mockReply,
        );

        const result = await handleCreateReply(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
          message_id: "msg1",
          text: "Great idea!",
        });

        expect(result.structuredContent.reply).toEqual(mockReply);
      });
    });

    describe("handleGetReplies", () => {
      it("should get replies successfully", async () => {
        const mockReplies = {
          replies: [
            { id: "reply1", text: "Great!" },
            { id: "reply2", text: "Agreed!" },
          ],
        };
        mockClickUpService.chatService.getReplies.mockResolvedValue(
          mockReplies,
        );

        const result = await handleGetReplies(mockClickUpService, {
          workspace_id: "ws123",
          channel_id: "ch1",
          message_id: "msg1",
          limit: 5,
          offset: 0,
        });

        expect(result.structuredContent.replies).toEqual(mockReplies.replies);
      });
    });
  });

  describe("User Handler", () => {
    describe("handleGetMentionableUsers", () => {
      it("should get mentionable users successfully", async () => {
        const mockUsers = {
          users: [
            { id: "user1", name: "John" },
            { id: "user2", name: "Jane" },
          ],
        };
        mockClickUpService.chatService.getMentionableUsers.mockResolvedValue(
          mockUsers,
        );

        const result = await handleGetMentionableUsers(mockClickUpService, {
          workspace_id: "ws123",
        });

        expect(result.structuredContent.users).toEqual(mockUsers.users);
      });

      it("should throw error on missing workspace_id", async () => {
        await expect(
          handleGetMentionableUsers(mockClickUpService, {}),
        ).rejects.toThrow("Workspace ID is required and must be a string.");
      });
    });
  });

  describe("Response Format", () => {
    it("should always return content and structuredContent", async () => {
      const mockChannels = { channels: [] };
      mockClickUpService.chatService.getChannels.mockResolvedValue(
        mockChannels,
      );

      const result = await handleGetChannels(mockClickUpService, {
        workspace_id: "ws123",
      });

      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("structuredContent");
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty("type", "text");
      expect(result.content[0]).toHaveProperty("text");
    });
  });
});
