import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ClickUpService } from "../services/clickup.service.js";
import { logger } from "../logger.js";

export const uploadAttachmentTool: Tool = {
  name: "clickup_upload_attachment",
  description: "Upload a file attachment to a ClickUp task",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The unique identifier of the task.",
      },
      file_path: {
        type: "string",
        description: "The local file path of the file to upload.",
      },
      file_name: {
        type: "string",
        description: "Optional: Custom filename for the attachment.",
      },
    },
    required: ["task_id", "file_path"],
  },
  outputSchema: {
    type: "object",
    properties: {
      attachment: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The uploaded attachment object.",
  },
};

export const deleteAttachmentTool: Tool = {
  name: "clickup_delete_attachment",
  description: "Delete an attachment from ClickUp",
  inputSchema: {
    type: "object",
    properties: {
      attachment_id: {
        type: "string",
        description: "The unique identifier of the attachment.",
      },
    },
    required: ["attachment_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
      },
    },
    description: "Confirmation of attachment deletion.",
  },
};

// Handler functions

export async function handleUploadAttachment(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { task_id, file_path, file_name } = args as {
    task_id: string;
    file_path: string;
    file_name?: string;
  };

  if (!task_id || typeof task_id !== "string") {
    throw new Error("Task ID is required and must be a string.");
  }
  if (!file_path || typeof file_path !== "string") {
    throw new Error("File path is required and must be a string.");
  }

  logger.info(`Handling tool call: ${uploadAttachmentTool.name} for task ${task_id}`);
  try {
    const response = await clickUpService.attachmentService.uploadAttachment(
      task_id,
      file_path,
      file_name,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { attachment: response },
    };
  } catch (error) {
    logger.error(`Error in ${uploadAttachmentTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to upload attachment");
  }
}

export async function handleDeleteAttachment(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { attachment_id } = args as { attachment_id: string };

  if (!attachment_id || typeof attachment_id !== "string") {
    throw new Error("Attachment ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${deleteAttachmentTool.name} for attachment ${attachment_id}`);
  try {
    await clickUpService.attachmentService.deleteAttachment(attachment_id);
    return {
      content: [
        {
          type: "text",
          text: `Attachment ${attachment_id} deleted successfully`,
        },
      ],
      structuredContent: { success: true },
    };
  } catch (error) {
    logger.error(`Error in ${deleteAttachmentTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to delete attachment");
  }
}
