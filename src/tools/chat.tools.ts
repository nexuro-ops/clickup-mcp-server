import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ClickUpService } from "../services/clickup.service.js";
import { logger } from "../logger.js";

// Channel tools
export const getChannelsTool: Tool = {
  name: "clickup_get_channels",
  description: "Get all chat channels in a workspace",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
    },
    required: ["workspace_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      channels: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    description: "An array of channel objects.",
  },
};

export const createChannelTool: Tool = {
  name: "clickup_create_chat_channel",
  description: "Create a new chat channel in a workspace",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      name: {
        type: "string",
        description: "Name of the channel.",
      },
      description: {
        type: "string",
        description: "Optional: Description of the channel.",
      },
      private: {
        type: "boolean",
        description: "Optional: Whether the channel is private.",
      },
    },
    required: ["workspace_id", "name"],
  },
  outputSchema: {
    type: "object",
    properties: {
      channel: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The created channel object.",
  },
};

export const getChannelTool: Tool = {
  name: "clickup_get_chat_channel",
  description: "Get details of a specific chat channel",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
    },
    required: ["workspace_id", "channel_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      channel: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The channel object.",
  },
};

export const updateChannelTool: Tool = {
  name: "clickup_update_chat_channel",
  description: "Update a chat channel",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
      name: {
        type: "string",
        description: "Optional: New name for the channel.",
      },
      description: {
        type: "string",
        description: "Optional: New description for the channel.",
      },
      private: {
        type: "boolean",
        description: "Optional: Set channel privacy.",
      },
    },
    required: ["workspace_id", "channel_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      channel: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The updated channel object.",
  },
};

export const deleteChannelTool: Tool = {
  name: "clickup_delete_chat_channel",
  description: "Delete a chat channel",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
    },
    required: ["workspace_id", "channel_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
      },
    },
    description: "Confirmation of channel deletion.",
  },
};

export const getChannelFollowersTool: Tool = {
  name: "clickup_get_channel_followers",
  description: "Get followers of a chat channel",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
    },
    required: ["workspace_id", "channel_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      followers: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    description: "An array of user followers.",
  },
};

export const getChannelMembersTool: Tool = {
  name: "clickup_get_channel_members",
  description: "Get members of a chat channel",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
    },
    required: ["workspace_id", "channel_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      members: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    description: "An array of channel members.",
  },
};

// Message tools
export const createMessageTool: Tool = {
  name: "clickup_create_chat_message",
  description: "Create a message in a chat channel",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
      text: {
        type: "string",
        description: "The message text content.",
      },
    },
    required: ["workspace_id", "channel_id", "text"],
  },
  outputSchema: {
    type: "object",
    properties: {
      message: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The created message object.",
  },
};

export const getMessagesTool: Tool = {
  name: "clickup_get_chat_messages",
  description: "Get messages from a chat channel",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
      limit: {
        type: "number",
        description: "Optional: Maximum number of messages to retrieve.",
      },
      offset: {
        type: "number",
        description: "Optional: Offset for pagination.",
      },
    },
    required: ["workspace_id", "channel_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      messages: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    description: "An array of message objects.",
  },
};

export const updateMessageTool: Tool = {
  name: "clickup_update_chat_message",
  description: "Update a message in a chat channel",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
      message_id: {
        type: "string",
        description: "The unique identifier of the message.",
      },
      text: {
        type: "string",
        description: "The updated message text.",
      },
    },
    required: ["workspace_id", "channel_id", "message_id", "text"],
  },
  outputSchema: {
    type: "object",
    properties: {
      message: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The updated message object.",
  },
};

export const deleteMessageTool: Tool = {
  name: "clickup_delete_chat_message",
  description: "Delete a message from a chat channel",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
      message_id: {
        type: "string",
        description: "The unique identifier of the message.",
      },
    },
    required: ["workspace_id", "channel_id", "message_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
      },
    },
    description: "Confirmation of message deletion.",
  },
};

// Direct message tool
export const createDirectMessageTool: Tool = {
  name: "clickup_create_direct_message",
  description: "Create a direct message in a workspace",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      user_id: {
        type: "string",
        description: "The ID of the user to send a direct message to.",
      },
      text: {
        type: "string",
        description: "The message text content.",
      },
    },
    required: ["workspace_id", "user_id", "text"],
  },
  outputSchema: {
    type: "object",
    properties: {
      message: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The created direct message object.",
  },
};

// Message reaction tools
export const createMessageReactionTool: Tool = {
  name: "clickup_create_message_reaction",
  description: "Create a reaction to a message",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
      message_id: {
        type: "string",
        description: "The unique identifier of the message.",
      },
      emoji: {
        type: "string",
        description: "The emoji reaction (e.g., 'thumbsup', 'heart').",
      },
    },
    required: ["workspace_id", "channel_id", "message_id", "emoji"],
  },
  outputSchema: {
    type: "object",
    properties: {
      reaction: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The created reaction object.",
  },
};

export const getMessageReactionsTool: Tool = {
  name: "clickup_get_message_reactions",
  description: "Get all reactions on a message",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
      message_id: {
        type: "string",
        description: "The unique identifier of the message.",
      },
    },
    required: ["workspace_id", "channel_id", "message_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      reactions: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    description: "An array of reaction objects.",
  },
};

export const deleteMessageReactionTool: Tool = {
  name: "clickup_delete_message_reaction",
  description: "Delete a reaction from a message",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
      message_id: {
        type: "string",
        description: "The unique identifier of the message.",
      },
      reaction_id: {
        type: "string",
        description: "The unique identifier of the reaction.",
      },
    },
    required: ["workspace_id", "channel_id", "message_id", "reaction_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
      },
    },
    description: "Confirmation of reaction deletion.",
  },
};

// Reply tools
export const createReplyTool: Tool = {
  name: "clickup_create_chat_reply",
  description: "Create a reply to a message in a chat channel",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
      message_id: {
        type: "string",
        description: "The unique identifier of the message to reply to.",
      },
      text: {
        type: "string",
        description: "The reply text content.",
      },
    },
    required: ["workspace_id", "channel_id", "message_id", "text"],
  },
  outputSchema: {
    type: "object",
    properties: {
      reply: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The created reply object.",
  },
};

export const getRepliesTool: Tool = {
  name: "clickup_get_chat_replies",
  description: "Get replies to a message in a chat channel",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
      channel_id: {
        type: "string",
        description: "The unique identifier of the channel.",
      },
      message_id: {
        type: "string",
        description: "The unique identifier of the message.",
      },
      limit: {
        type: "number",
        description: "Optional: Maximum number of replies to retrieve.",
      },
      offset: {
        type: "number",
        description: "Optional: Offset for pagination.",
      },
    },
    required: ["workspace_id", "channel_id", "message_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      replies: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    description: "An array of reply objects.",
  },
};

// User tools
export const getMentionableUsersTool: Tool = {
  name: "clickup_get_mentionable_users",
  description: "Get users that can be mentioned in chat for a workspace",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "string",
        description: "The ID of the Workspace (Team) to operate on.",
      },
    },
    required: ["workspace_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      users: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    description: "An array of user objects.",
  },
};

// Handler functions

export async function handleGetChannels(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id } = args as { workspace_id: string };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${getChannelsTool.name}`);
  try {
    const response = await clickUpService.chatService.getChannels(workspace_id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { channels: response.channels || [] },
    };
  } catch (error) {
    logger.error(`Error in ${getChannelsTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to get channels");
  }
}

export async function handleCreateChannel(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, name, description, private: isPrivate } = args as {
    workspace_id: string;
    name: string;
    description?: string;
    private?: boolean;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!name || typeof name !== "string") {
    throw new Error("Channel name is required and must be a string.");
  }

  const channelData: any = { name };
  if (description) channelData.description = description;
  if (isPrivate !== undefined) channelData.private = isPrivate;

  logger.info(`Handling tool call: ${createChannelTool.name}`);
  try {
    const response = await clickUpService.chatService.createChannel(
      workspace_id,
      channelData,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { channel: response },
    };
  } catch (error) {
    logger.error(`Error in ${createChannelTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to create channel");
  }
}

export async function handleGetChannel(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id } = args as {
    workspace_id: string;
    channel_id: string;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${getChannelTool.name}`);
  try {
    const response = await clickUpService.chatService.getChannel(
      workspace_id,
      channel_id,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { channel: response },
    };
  } catch (error) {
    logger.error(`Error in ${getChannelTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get channel");
  }
}

export async function handleUpdateChannel(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id, name, description, private: isPrivate } =
    args as {
      workspace_id: string;
      channel_id: string;
      name?: string;
      description?: string;
      private?: boolean;
    };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }

  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (isPrivate !== undefined) updateData.private = isPrivate;

  logger.info(`Handling tool call: ${updateChannelTool.name}`);
  try {
    const response = await clickUpService.chatService.updateChannel(
      workspace_id,
      channel_id,
      updateData,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { channel: response },
    };
  } catch (error) {
    logger.error(`Error in ${updateChannelTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to update channel");
  }
}

export async function handleDeleteChannel(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id } = args as {
    workspace_id: string;
    channel_id: string;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${deleteChannelTool.name}`);
  try {
    await clickUpService.chatService.deleteChannel(workspace_id, channel_id);
    return {
      content: [
        {
          type: "text",
          text: `Channel ${channel_id} deleted successfully`,
        },
      ],
      structuredContent: { success: true },
    };
  } catch (error) {
    logger.error(`Error in ${deleteChannelTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to delete channel");
  }
}

export async function handleGetChannelFollowers(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id } = args as {
    workspace_id: string;
    channel_id: string;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${getChannelFollowersTool.name}`);
  try {
    const response = await clickUpService.chatService.getChannelFollowers(
      workspace_id,
      channel_id,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { followers: response.followers || [] },
    };
  } catch (error) {
    logger.error(`Error in ${getChannelFollowersTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get channel followers");
  }
}

export async function handleGetChannelMembers(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id } = args as {
    workspace_id: string;
    channel_id: string;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${getChannelMembersTool.name}`);
  try {
    const response = await clickUpService.chatService.getChannelMembers(
      workspace_id,
      channel_id,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { members: response.members || [] },
    };
  } catch (error) {
    logger.error(`Error in ${getChannelMembersTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get channel members");
  }
}

export async function handleCreateMessage(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id, text } = args as {
    workspace_id: string;
    channel_id: string;
    text: string;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }
  if (!text || typeof text !== "string") {
    throw new Error("Message text is required and must be a string.");
  }

  logger.info(`Handling tool call: ${createMessageTool.name}`);
  try {
    const response = await clickUpService.chatService.createMessage(
      workspace_id,
      channel_id,
      { text },
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { message: response },
    };
  } catch (error) {
    logger.error(`Error in ${createMessageTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to create message");
  }
}

export async function handleGetMessages(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id, limit, offset } = args as {
    workspace_id: string;
    channel_id: string;
    limit?: number;
    offset?: number;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }

  const params: any = {};
  if (limit !== undefined) params.limit = limit;
  if (offset !== undefined) params.offset = offset;

  logger.info(`Handling tool call: ${getMessagesTool.name}`);
  try {
    const response = await clickUpService.chatService.getMessages(
      workspace_id,
      channel_id,
      params,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { messages: response.messages || [] },
    };
  } catch (error) {
    logger.error(`Error in ${getMessagesTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get messages");
  }
}

export async function handleUpdateMessage(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id, message_id, text } = args as {
    workspace_id: string;
    channel_id: string;
    message_id: string;
    text: string;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }
  if (!message_id || typeof message_id !== "string") {
    throw new Error("Message ID is required and must be a string.");
  }
  if (!text || typeof text !== "string") {
    throw new Error("Message text is required and must be a string.");
  }

  logger.info(`Handling tool call: ${updateMessageTool.name}`);
  try {
    const response = await clickUpService.chatService.updateMessage(
      workspace_id,
      channel_id,
      message_id,
      { text },
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { message: response },
    };
  } catch (error) {
    logger.error(`Error in ${updateMessageTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to update message");
  }
}

export async function handleDeleteMessage(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id, message_id } = args as {
    workspace_id: string;
    channel_id: string;
    message_id: string;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }
  if (!message_id || typeof message_id !== "string") {
    throw new Error("Message ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${deleteMessageTool.name}`);
  try {
    await clickUpService.chatService.deleteMessage(
      workspace_id,
      channel_id,
      message_id,
    );
    return {
      content: [
        {
          type: "text",
          text: `Message ${message_id} deleted successfully`,
        },
      ],
      structuredContent: { success: true },
    };
  } catch (error) {
    logger.error(`Error in ${deleteMessageTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to delete message");
  }
}

export async function handleCreateDirectMessage(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, user_id, text } = args as {
    workspace_id: string;
    user_id: string;
    text: string;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!user_id || typeof user_id !== "string") {
    throw new Error("User ID is required and must be a string.");
  }
  if (!text || typeof text !== "string") {
    throw new Error("Message text is required and must be a string.");
  }

  logger.info(`Handling tool call: ${createDirectMessageTool.name}`);
  try {
    const response = await clickUpService.chatService.createDirectMessage(
      workspace_id,
      { user_id, text },
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { message: response },
    };
  } catch (error) {
    logger.error(`Error in ${createDirectMessageTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to create direct message");
  }
}

export async function handleCreateMessageReaction(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id, message_id, emoji } = args as {
    workspace_id: string;
    channel_id: string;
    message_id: string;
    emoji: string;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }
  if (!message_id || typeof message_id !== "string") {
    throw new Error("Message ID is required and must be a string.");
  }
  if (!emoji || typeof emoji !== "string") {
    throw new Error("Emoji is required and must be a string.");
  }

  logger.info(`Handling tool call: ${createMessageReactionTool.name}`);
  try {
    const response = await clickUpService.chatService.createMessageReaction(
      workspace_id,
      channel_id,
      message_id,
      { emoji },
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { reaction: response },
    };
  } catch (error) {
    logger.error(`Error in ${createMessageReactionTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to create message reaction");
  }
}

export async function handleGetMessageReactions(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id, message_id } = args as {
    workspace_id: string;
    channel_id: string;
    message_id: string;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }
  if (!message_id || typeof message_id !== "string") {
    throw new Error("Message ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${getMessageReactionsTool.name}`);
  try {
    const response = await clickUpService.chatService.getMessageReactions(
      workspace_id,
      channel_id,
      message_id,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { reactions: response.reactions || [] },
    };
  } catch (error) {
    logger.error(`Error in ${getMessageReactionsTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get message reactions");
  }
}

export async function handleDeleteMessageReaction(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id, message_id, reaction_id } = args as {
    workspace_id: string;
    channel_id: string;
    message_id: string;
    reaction_id: string;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }
  if (!message_id || typeof message_id !== "string") {
    throw new Error("Message ID is required and must be a string.");
  }
  if (!reaction_id || typeof reaction_id !== "string") {
    throw new Error("Reaction ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${deleteMessageReactionTool.name}`);
  try {
    await clickUpService.chatService.deleteMessageReaction(
      workspace_id,
      channel_id,
      message_id,
      reaction_id,
    );
    return {
      content: [
        {
          type: "text",
          text: `Reaction ${reaction_id} deleted successfully`,
        },
      ],
      structuredContent: { success: true },
    };
  } catch (error) {
    logger.error(`Error in ${deleteMessageReactionTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to delete message reaction");
  }
}

export async function handleCreateReply(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id, message_id, text } = args as {
    workspace_id: string;
    channel_id: string;
    message_id: string;
    text: string;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }
  if (!message_id || typeof message_id !== "string") {
    throw new Error("Message ID is required and must be a string.");
  }
  if (!text || typeof text !== "string") {
    throw new Error("Reply text is required and must be a string.");
  }

  logger.info(`Handling tool call: ${createReplyTool.name}`);
  try {
    const response = await clickUpService.chatService.createReply(
      workspace_id,
      channel_id,
      message_id,
      { text },
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { reply: response },
    };
  } catch (error) {
    logger.error(`Error in ${createReplyTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to create reply");
  }
}

export async function handleGetReplies(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id, channel_id, message_id, limit, offset } = args as {
    workspace_id: string;
    channel_id: string;
    message_id: string;
    limit?: number;
    offset?: number;
  };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }
  if (!channel_id || typeof channel_id !== "string") {
    throw new Error("Channel ID is required and must be a string.");
  }
  if (!message_id || typeof message_id !== "string") {
    throw new Error("Message ID is required and must be a string.");
  }

  const params: any = {};
  if (limit !== undefined) params.limit = limit;
  if (offset !== undefined) params.offset = offset;

  logger.info(`Handling tool call: ${getRepliesTool.name}`);
  try {
    const response = await clickUpService.chatService.getReplies(
      workspace_id,
      channel_id,
      message_id,
      params,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { replies: response.replies || [] },
    };
  } catch (error) {
    logger.error(`Error in ${getRepliesTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get replies");
  }
}

export async function handleGetMentionableUsers(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { workspace_id } = args as { workspace_id: string };

  if (!workspace_id || typeof workspace_id !== "string") {
    throw new Error("Workspace ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${getMentionableUsersTool.name}`);
  try {
    const response = await clickUpService.chatService.getMentionableUsers(
      workspace_id,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { users: response.users || [] },
    };
  } catch (error) {
    logger.error(`Error in ${getMentionableUsersTool.name}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get mentionable users");
  }
}
