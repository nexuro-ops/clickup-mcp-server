import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ClickUpService } from "../services/clickup.service.js";
import { logger } from "../logger.js";

export const createCommentTool: Tool = {
  name: "clickup_create_comment",
  description: "Create a comment on a ClickUp task",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The unique identifier of the task to comment on.",
      },
      comment_text: {
        type: "string",
        description: "The text content of the comment (supports ClickUp Markdown).",
      },
      assignee: {
        type: "number",
        description: "Optional: User ID to assign the comment to.",
      },
      notify_all: {
        type: "boolean",
        description: "Optional: Notify all task members (default: true).",
      },
    },
    required: ["task_id", "comment_text"],
  },
  outputSchema: {
    type: "object",
    properties: {
      comment: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The created comment object.",
  },
};

export const getCommentsTool: Tool = {
  name: "clickup_get_comments",
  description: "Get all comments on a ClickUp task",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The unique identifier of the task.",
      },
    },
    required: ["task_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      comments: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    description: "An array of comment objects.",
  },
};

export const updateCommentTool: Tool = {
  name: "clickup_update_comment",
  description: "Update a comment on a ClickUp task",
  inputSchema: {
    type: "object",
    properties: {
      comment_id: {
        type: "string",
        description: "The unique identifier of the comment to update.",
      },
      comment_text: {
        type: "string",
        description: "The updated text content of the comment.",
      },
      assignee: {
        type: "number",
        description: "Optional: User ID to assign the comment to.",
      },
      resolved: {
        type: "boolean",
        description: "Optional: Mark comment as resolved.",
      },
    },
    required: ["comment_id", "comment_text"],
  },
  outputSchema: {
    type: "object",
    properties: {
      comment: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The updated comment object.",
  },
};

export const deleteCommentTool: Tool = {
  name: "clickup_delete_comment",
  description: "Delete a comment from a ClickUp task",
  inputSchema: {
    type: "object",
    properties: {
      comment_id: {
        type: "string",
        description: "The unique identifier of the comment to delete.",
      },
    },
    required: ["comment_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
      },
    },
    description: "Confirmation of comment deletion.",
  },
};

// Handler functions

export async function handleCreateComment(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { task_id, comment_text, assignee, notify_all } = args as {
    task_id: string;
    comment_text: string;
    assignee?: number;
    notify_all?: boolean;
  };

  if (!task_id || typeof task_id !== "string") {
    throw new Error("Task ID is required and must be a string.");
  }
  if (!comment_text || typeof comment_text !== "string") {
    throw new Error("Comment text is required and must be a string.");
  }

  const commentData: any = {
    comment_text,
    notify_all: notify_all !== undefined ? notify_all : true,
  };

  if (assignee !== undefined) {
    commentData.assignee = assignee;
  }

  logger.info(`Handling tool call: ${createCommentTool.name} for task ${task_id}`);
  try {
    const response = await clickUpService.commentService.createComment(
      task_id,
      commentData,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { comment: response },
    };
  } catch (error) {
    logger.error(`Error in ${createCommentTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to create comment");
  }
}

export async function handleGetComments(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { task_id } = args as { task_id: string };

  if (!task_id || typeof task_id !== "string") {
    throw new Error("Task ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${getCommentsTool.name} for task ${task_id}`);
  try {
    const response = await clickUpService.commentService.getComments(task_id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { comments: response.comments || [] },
    };
  } catch (error) {
    logger.error(`Error in ${getCommentsTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to get comments");
  }
}

export async function handleUpdateComment(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { comment_id, comment_text, assignee, resolved } = args as {
    comment_id: string;
    comment_text: string;
    assignee?: number;
    resolved?: boolean;
  };

  if (!comment_id || typeof comment_id !== "string") {
    throw new Error("Comment ID is required and must be a string.");
  }
  if (!comment_text || typeof comment_text !== "string") {
    throw new Error("Comment text is required and must be a string.");
  }

  const updateData: any = { comment_text };
  if (assignee !== undefined) {
    updateData.assignee = assignee;
  }
  if (resolved !== undefined) {
    updateData.resolved = resolved;
  }

  logger.info(`Handling tool call: ${updateCommentTool.name} for comment ${comment_id}`);
  try {
    const response = await clickUpService.commentService.updateComment(
      comment_id,
      updateData,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { comment: response },
    };
  } catch (error) {
    logger.error(`Error in ${updateCommentTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to update comment");
  }
}

export async function handleDeleteComment(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { comment_id } = args as { comment_id: string };

  if (!comment_id || typeof comment_id !== "string") {
    throw new Error("Comment ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${deleteCommentTool.name} for comment ${comment_id}`);
  try {
    await clickUpService.commentService.deleteComment(comment_id);
    return {
      content: [
        {
          type: "text",
          text: `Comment ${comment_id} deleted successfully`,
        },
      ],
      structuredContent: { success: true },
    };
  } catch (error) {
    logger.error(`Error in ${deleteCommentTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to delete comment");
  }
}
