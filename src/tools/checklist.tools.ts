import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ClickUpService } from "../services/clickup.service.js";
import { logger } from "../logger.js";

export const createChecklistTool: Tool = {
  name: "clickup_create_checklist",
  description: "Create a checklist on a ClickUp task",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The unique identifier of the task.",
      },
      name: {
        type: "string",
        description: "The name of the checklist.",
      },
    },
    required: ["task_id", "name"],
  },
  outputSchema: {
    type: "object",
    properties: {
      checklist: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The created checklist object.",
  },
};

export const updateChecklistTool: Tool = {
  name: "clickup_update_checklist",
  description: "Update a checklist in ClickUp",
  inputSchema: {
    type: "object",
    properties: {
      checklist_id: {
        type: "string",
        description: "The unique identifier of the checklist.",
      },
      name: {
        type: "string",
        description: "The updated name of the checklist.",
      },
      position: {
        type: "number",
        description: "The position/order index of the checklist.",
      },
    },
    required: ["checklist_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      checklist: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The updated checklist object.",
  },
};

export const deleteChecklistTool: Tool = {
  name: "clickup_delete_checklist",
  description: "Delete a checklist from a ClickUp task",
  inputSchema: {
    type: "object",
    properties: {
      checklist_id: {
        type: "string",
        description: "The unique identifier of the checklist.",
      },
    },
    required: ["checklist_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
      },
    },
    description: "Confirmation of checklist deletion.",
  },
};

export const createChecklistItemTool: Tool = {
  name: "clickup_create_checklist_item",
  description: "Create an item in a ClickUp checklist",
  inputSchema: {
    type: "object",
    properties: {
      checklist_id: {
        type: "string",
        description: "The unique identifier of the checklist.",
      },
      name: {
        type: "string",
        description: "The name/text of the checklist item.",
      },
      assignee: {
        type: "number",
        description: "Optional: User ID to assign the item to.",
      },
    },
    required: ["checklist_id", "name"],
  },
  outputSchema: {
    type: "object",
    properties: {
      checklist: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The updated checklist with the new item.",
  },
};

export const updateChecklistItemTool: Tool = {
  name: "clickup_update_checklist_item",
  description: "Update an item in a ClickUp checklist",
  inputSchema: {
    type: "object",
    properties: {
      checklist_id: {
        type: "string",
        description: "The unique identifier of the checklist.",
      },
      checklist_item_id: {
        type: "string",
        description: "The unique identifier of the checklist item.",
      },
      name: {
        type: "string",
        description: "The updated name/text of the item.",
      },
      resolved: {
        type: "boolean",
        description: "Mark the item as resolved/checked.",
      },
      assignee: {
        type: "number",
        description: "User ID to assign the item to.",
      },
      parent: {
        type: "string",
        description: "Parent checklist item ID (for nesting).",
      },
    },
    required: ["checklist_id", "checklist_item_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      checklist: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The updated checklist with the modified item.",
  },
};

export const deleteChecklistItemTool: Tool = {
  name: "clickup_delete_checklist_item",
  description: "Delete an item from a ClickUp checklist",
  inputSchema: {
    type: "object",
    properties: {
      checklist_id: {
        type: "string",
        description: "The unique identifier of the checklist.",
      },
      checklist_item_id: {
        type: "string",
        description: "The unique identifier of the checklist item.",
      },
    },
    required: ["checklist_id", "checklist_item_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
      },
    },
    description: "Confirmation of checklist item deletion.",
  },
};

// Handler functions

export async function handleCreateChecklist(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { task_id, name } = args as {
    task_id: string;
    name: string;
  };

  if (!task_id || typeof task_id !== "string") {
    throw new Error("Task ID is required and must be a string.");
  }
  if (!name || typeof name !== "string") {
    throw new Error("Checklist name is required and must be a string.");
  }

  logger.info(`Handling tool call: ${createChecklistTool.name} for task ${task_id}`);
  try {
    const response = await clickUpService.checklistService.createChecklist(
      task_id,
      { name },
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { checklist: response.checklist || response },
    };
  } catch (error) {
    logger.error(`Error in ${createChecklistTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to create checklist");
  }
}

export async function handleUpdateChecklist(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { checklist_id, name, position } = args as {
    checklist_id: string;
    name?: string;
    position?: number;
  };

  if (!checklist_id || typeof checklist_id !== "string") {
    throw new Error("Checklist ID is required and must be a string.");
  }

  const updateData: any = {};
  if (name) updateData.name = name;
  if (position !== undefined) updateData.position = position;

  if (Object.keys(updateData).length === 0) {
    throw new Error("At least one field (name or position) must be provided.");
  }

  logger.info(`Handling tool call: ${updateChecklistTool.name} for checklist ${checklist_id}`);
  try {
    const response = await clickUpService.checklistService.updateChecklist(
      checklist_id,
      updateData,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { checklist: response.checklist || response },
    };
  } catch (error) {
    logger.error(`Error in ${updateChecklistTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to update checklist");
  }
}

export async function handleDeleteChecklist(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { checklist_id } = args as { checklist_id: string };

  if (!checklist_id || typeof checklist_id !== "string") {
    throw new Error("Checklist ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${deleteChecklistTool.name} for checklist ${checklist_id}`);
  try {
    await clickUpService.checklistService.deleteChecklist(checklist_id);
    return {
      content: [
        {
          type: "text",
          text: `Checklist ${checklist_id} deleted successfully`,
        },
      ],
      structuredContent: { success: true },
    };
  } catch (error) {
    logger.error(`Error in ${deleteChecklistTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to delete checklist");
  }
}

export async function handleCreateChecklistItem(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { checklist_id, name, assignee } = args as {
    checklist_id: string;
    name: string;
    assignee?: number;
  };

  if (!checklist_id || typeof checklist_id !== "string") {
    throw new Error("Checklist ID is required and must be a string.");
  }
  if (!name || typeof name !== "string") {
    throw new Error("Item name is required and must be a string.");
  }

  const itemData: any = { name };
  if (assignee !== undefined) {
    itemData.assignee = assignee;
  }

  logger.info(`Handling tool call: ${createChecklistItemTool.name} for checklist ${checklist_id}`);
  try {
    const response = await clickUpService.checklistService.createChecklistItem(
      checklist_id,
      itemData,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { checklist: response.checklist || response },
    };
  } catch (error) {
    logger.error(`Error in ${createChecklistItemTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to create checklist item");
  }
}

export async function handleUpdateChecklistItem(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { checklist_id, checklist_item_id, name, resolved, assignee, parent } = args as {
    checklist_id: string;
    checklist_item_id: string;
    name?: string;
    resolved?: boolean;
    assignee?: number;
    parent?: string;
  };

  if (!checklist_id || typeof checklist_id !== "string") {
    throw new Error("Checklist ID is required and must be a string.");
  }
  if (!checklist_item_id || typeof checklist_item_id !== "string") {
    throw new Error("Checklist item ID is required and must be a string.");
  }

  const updateData: any = {};
  if (name) updateData.name = name;
  if (resolved !== undefined) updateData.resolved = resolved;
  if (assignee !== undefined) updateData.assignee = assignee;
  if (parent) updateData.parent = parent;

  if (Object.keys(updateData).length === 0) {
    throw new Error("At least one field must be provided to update.");
  }

  logger.info(`Handling tool call: ${updateChecklistItemTool.name} for item ${checklist_item_id}`);
  try {
    const response = await clickUpService.checklistService.updateChecklistItem(
      checklist_id,
      checklist_item_id,
      updateData,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { checklist: response.checklist || response },
    };
  } catch (error) {
    logger.error(`Error in ${updateChecklistItemTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to update checklist item");
  }
}

export async function handleDeleteChecklistItem(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { checklist_id, checklist_item_id } = args as {
    checklist_id: string;
    checklist_item_id: string;
  };

  if (!checklist_id || typeof checklist_id !== "string") {
    throw new Error("Checklist ID is required and must be a string.");
  }
  if (!checklist_item_id || typeof checklist_item_id !== "string") {
    throw new Error("Checklist item ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${deleteChecklistItemTool.name} for item ${checklist_item_id}`);
  try {
    await clickUpService.checklistService.deleteChecklistItem(
      checklist_id,
      checklist_item_id,
    );
    return {
      content: [
        {
          type: "text",
          text: `Checklist item ${checklist_item_id} deleted successfully`,
        },
      ],
      structuredContent: { success: true },
    };
  } catch (error) {
    logger.error(`Error in ${deleteChecklistItemTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to delete checklist item");
  }
}
