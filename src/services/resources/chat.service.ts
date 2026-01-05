import axios, { AxiosInstance } from "axios";
import { logger } from "../../logger.js";

export class ChatService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  // Channel Operations

  async getChannels(workspaceId: string): Promise<any> {
    logger.debug(`Getting channels for workspace ${workspaceId}`);
    try {
      const response = await this.client.get<any>(
        `/v3/workspaces/${workspaceId}/chat/channels`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error getting channels: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error getting channels: ${error.message}`);
      }
      throw new Error("Failed to get channels from ClickUp");
    }
  }

  async createChannel(workspaceId: string, channelData: any): Promise<any> {
    logger.debug(`Creating channel in workspace ${workspaceId}`);
    try {
      const response = await this.client.post<any>(
        `/v3/workspaces/${workspaceId}/chat/channels`,
        channelData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error creating channel: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error creating channel: ${error.message}`);
      }
      throw new Error("Failed to create channel in ClickUp");
    }
  }

  async getChannel(workspaceId: string, channelId: string): Promise<any> {
    logger.debug(`Getting channel ${channelId} in workspace ${workspaceId}`);
    try {
      const response = await this.client.get<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error getting channel: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error getting channel: ${error.message}`);
      }
      throw new Error("Failed to get channel from ClickUp");
    }
  }

  async updateChannel(
    workspaceId: string,
    channelId: string,
    updateData: any,
  ): Promise<any> {
    logger.debug(`Updating channel ${channelId} in workspace ${workspaceId}`);
    try {
      const response = await this.client.put<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}`,
        updateData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error updating channel: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error updating channel: ${error.message}`);
      }
      throw new Error("Failed to update channel in ClickUp");
    }
  }

  async deleteChannel(workspaceId: string, channelId: string): Promise<any> {
    logger.debug(`Deleting channel ${channelId} in workspace ${workspaceId}`);
    try {
      const response = await this.client.delete<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error deleting channel: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error deleting channel: ${error.message}`);
      }
      throw new Error("Failed to delete channel in ClickUp");
    }
  }

  async getChannelFollowers(
    workspaceId: string,
    channelId: string,
  ): Promise<any> {
    logger.debug(
      `Getting followers for channel ${channelId} in workspace ${workspaceId}`,
    );
    try {
      const response = await this.client.get<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/followers`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error getting channel followers: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(
          `Generic error getting channel followers: ${error.message}`,
        );
      }
      throw new Error("Failed to get channel followers from ClickUp");
    }
  }

  async getChannelMembers(workspaceId: string, channelId: string): Promise<any> {
    logger.debug(
      `Getting members for channel ${channelId} in workspace ${workspaceId}`,
    );
    try {
      const response = await this.client.get<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/members`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error getting channel members: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error getting channel members: ${error.message}`);
      }
      throw new Error("Failed to get channel members from ClickUp");
    }
  }

  // Message Operations

  async createMessage(
    workspaceId: string,
    channelId: string,
    messageData: any,
  ): Promise<any> {
    logger.debug(
      `Creating message in channel ${channelId} in workspace ${workspaceId}`,
    );
    try {
      const response = await this.client.post<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages`,
        messageData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error creating message: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error creating message: ${error.message}`);
      }
      throw new Error("Failed to create message in ClickUp");
    }
  }

  async getMessages(
    workspaceId: string,
    channelId: string,
    pagination?: any,
  ): Promise<any> {
    logger.debug(
      `Getting messages for channel ${channelId} in workspace ${workspaceId}`,
    );
    try {
      const params =
        pagination && Object.keys(pagination).length > 0 ? pagination : undefined;
      const response = await this.client.get<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages`,
        { params },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error getting messages: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error getting messages: ${error.message}`);
      }
      throw new Error("Failed to get messages from ClickUp");
    }
  }

  async updateMessage(
    workspaceId: string,
    channelId: string,
    messageId: string,
    updateData: any,
  ): Promise<any> {
    logger.debug(
      `Updating message ${messageId} in channel ${channelId} in workspace ${workspaceId}`,
    );
    try {
      const response = await this.client.put<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}`,
        updateData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error updating message: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error updating message: ${error.message}`);
      }
      throw new Error("Failed to update message in ClickUp");
    }
  }

  async deleteMessage(
    workspaceId: string,
    channelId: string,
    messageId: string,
  ): Promise<any> {
    logger.debug(
      `Deleting message ${messageId} in channel ${channelId} in workspace ${workspaceId}`,
    );
    try {
      const response = await this.client.delete<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error deleting message: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error deleting message: ${error.message}`);
      }
      throw new Error("Failed to delete message in ClickUp");
    }
  }

  // Direct Message Operations

  async createDirectMessage(workspaceId: string, dmData: any): Promise<any> {
    logger.debug(`Creating direct message in workspace ${workspaceId}`);
    try {
      const response = await this.client.post<any>(
        `/v3/workspaces/${workspaceId}/chat/direct_messages`,
        dmData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error creating direct message: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(
          `Generic error creating direct message: ${error.message}`,
        );
      }
      throw new Error("Failed to create direct message in ClickUp");
    }
  }

  // Message Reaction Operations

  async createMessageReaction(
    workspaceId: string,
    channelId: string,
    messageId: string,
    reactionData: any,
  ): Promise<any> {
    logger.debug(
      `Creating reaction on message ${messageId} in channel ${channelId} in workspace ${workspaceId}`,
    );
    try {
      const response = await this.client.post<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}/reactions`,
        reactionData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `Axios error creating message reaction: ${error.message}`,
          {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
          },
        );
      } else if (error instanceof Error) {
        logger.error(`Generic error creating message reaction: ${error.message}`);
      }
      throw new Error("Failed to create message reaction in ClickUp");
    }
  }

  async getMessageReactions(
    workspaceId: string,
    channelId: string,
    messageId: string,
  ): Promise<any> {
    logger.debug(
      `Getting reactions for message ${messageId} in channel ${channelId} in workspace ${workspaceId}`,
    );
    try {
      const response = await this.client.get<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}/reactions`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `Axios error getting message reactions: ${error.message}`,
          {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
          },
        );
      } else if (error instanceof Error) {
        logger.error(`Generic error getting message reactions: ${error.message}`);
      }
      throw new Error("Failed to get message reactions from ClickUp");
    }
  }

  async deleteMessageReaction(
    workspaceId: string,
    channelId: string,
    messageId: string,
    reactionId: string,
  ): Promise<any> {
    logger.debug(
      `Deleting reaction ${reactionId} on message ${messageId} in channel ${channelId} in workspace ${workspaceId}`,
    );
    try {
      const response = await this.client.delete<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}/reactions/${reactionId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `Axios error deleting message reaction: ${error.message}`,
          {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
          },
        );
      } else if (error instanceof Error) {
        logger.error(`Generic error deleting message reaction: ${error.message}`);
      }
      throw new Error("Failed to delete message reaction in ClickUp");
    }
  }

  // Reply Operations

  async createReply(
    workspaceId: string,
    channelId: string,
    messageId: string,
    replyData: any,
  ): Promise<any> {
    logger.debug(
      `Creating reply to message ${messageId} in channel ${channelId} in workspace ${workspaceId}`,
    );
    try {
      const response = await this.client.post<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}/replies`,
        replyData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error creating reply: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error creating reply: ${error.message}`);
      }
      throw new Error("Failed to create reply in ClickUp");
    }
  }

  async getReplies(
    workspaceId: string,
    channelId: string,
    messageId: string,
    pagination?: any,
  ): Promise<any> {
    logger.debug(
      `Getting replies for message ${messageId} in channel ${channelId} in workspace ${workspaceId}`,
    );
    try {
      const params =
        pagination && Object.keys(pagination).length > 0 ? pagination : undefined;
      const response = await this.client.get<any>(
        `/v3/workspaces/${workspaceId}/chat/channels/${channelId}/messages/${messageId}/replies`,
        { params },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error getting replies: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error getting replies: ${error.message}`);
      }
      throw new Error("Failed to get replies from ClickUp");
    }
  }

  // User Operations

  async getMentionableUsers(workspaceId: string): Promise<any> {
    logger.debug(`Getting mentionable users for workspace ${workspaceId}`);
    try {
      const response = await this.client.get<any>(
        `/v3/workspaces/${workspaceId}/chat/users`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error getting mentionable users: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(
          `Generic error getting mentionable users: ${error.message}`,
        );
      }
      throw new Error("Failed to get mentionable users from ClickUp");
    }
  }
}
