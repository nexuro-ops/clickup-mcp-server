import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ClickUpService } from "../services/clickup.service.js";
import { logger } from "../logger.js";

export const addDependencyTool: Tool = {
  name: "clickup_add_dependency",
  description: "Add a dependency relationship between tasks in ClickUp",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The unique identifier of the task.",
      },
      depends_on: {
        type: "string",
        description: "Task ID that this task depends on (this task is waiting for).",
      },
      dependency_of: {
        type: "string",
        description: "Task ID that depends on this task (this task is blocking).",
      },
    },
    required: ["task_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
      },
    },
    description: "Confirmation of dependency creation.",
  },
};

export const deleteDependencyTool: Tool = {
  name: "clickup_delete_dependency",
  description: "Remove a dependency relationship between tasks in ClickUp",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The unique identifier of the task.",
      },
      depends_on: {
        type: "string",
        description: "Task ID that this task depends on (to remove).",
      },
      dependency_of: {
        type: "string",
        description: "Task ID that depends on this task (to remove).",
      },
    },
    required: ["task_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
      },
    },
    description: "Confirmation of dependency removal.",
  },
};

export const addTaskLinkTool: Tool = {
  name: "clickup_add_task_link",
  description: "Create a link between two tasks in ClickUp",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The unique identifier of the task.",
      },
      links_to: {
        type: "string",
        description: "The task ID to link to.",
      },
    },
    required: ["task_id", "links_to"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
      },
    },
    description: "Confirmation of task link creation.",
  },
};

export const deleteTaskLinkTool: Tool = {
  name: "clickup_delete_task_link",
  description: "Remove a link between two tasks in ClickUp",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The unique identifier of the task.",
      },
      links_to: {
        type: "string",
        description: "The task ID to unlink from.",
      },
    },
    required: ["task_id", "links_to"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
      },
    },
    description: "Confirmation of task link removal.",
  },
};

// Handler functions

export async function handleAddDependency(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { task_id, depends_on, dependency_of } = args as {
    task_id: string;
    depends_on?: string;
    dependency_of?: string;
  };

  if (!task_id || typeof task_id !== "string") {
    throw new Error("Task ID is required and must be a string.");
  }
  if (!depends_on && !dependency_of) {
    throw new Error("Either depends_on or dependency_of must be provided.");
  }

  logger.info(`Handling tool call: ${addDependencyTool.name} for task ${task_id}`);
  try {
    await clickUpService.dependencyService.addDependency(
      task_id,
      depends_on!,
      dependency_of,
    );
    return {
      content: [
        {
          type: "text",
          text: "Dependency added successfully",
        },
      ],
      structuredContent: { success: true },
    };
  } catch (error) {
    logger.error(`Error in ${addDependencyTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to add dependency");
  }
}

export async function handleDeleteDependency(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { task_id, depends_on, dependency_of } = args as {
    task_id: string;
    depends_on?: string;
    dependency_of?: string;
  };

  if (!task_id || typeof task_id !== "string") {
    throw new Error("Task ID is required and must be a string.");
  }
  if (!depends_on && !dependency_of) {
    throw new Error("Either depends_on or dependency_of must be provided.");
  }

  logger.info(`Handling tool call: ${deleteDependencyTool.name} for task ${task_id}`);
  try {
    await clickUpService.dependencyService.deleteDependency(
      task_id,
      depends_on,
      dependency_of,
    );
    return {
      content: [
        {
          type: "text",
          text: "Dependency removed successfully",
        },
      ],
      structuredContent: { success: true },
    };
  } catch (error) {
    logger.error(`Error in ${deleteDependencyTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to delete dependency");
  }
}

export async function handleAddTaskLink(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { task_id, links_to } = args as {
    task_id: string;
    links_to: string;
  };

  if (!task_id || typeof task_id !== "string") {
    throw new Error("Task ID is required and must be a string.");
  }
  if (!links_to || typeof links_to !== "string") {
    throw new Error("Links to task ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${addTaskLinkTool.name} for task ${task_id}`);
  try {
    await clickUpService.dependencyService.addTaskLink(task_id, links_to);
    return {
      content: [
        {
          type: "text",
          text: "Task link added successfully",
        },
      ],
      structuredContent: { success: true },
    };
  } catch (error) {
    logger.error(`Error in ${addTaskLinkTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to add task link");
  }
}

export async function handleDeleteTaskLink(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { task_id, links_to } = args as {
    task_id: string;
    links_to: string;
  };

  if (!task_id || typeof task_id !== "string") {
    throw new Error("Task ID is required and must be a string.");
  }
  if (!links_to || typeof links_to !== "string") {
    throw new Error("Links to task ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${deleteTaskLinkTool.name} for task ${task_id}`);
  try {
    await clickUpService.dependencyService.deleteTaskLink(task_id, links_to);
    return {
      content: [
        {
          type: "text",
          text: "Task link removed successfully",
        },
      ],
      structuredContent: { success: true },
    };
  } catch (error) {
    logger.error(`Error in ${deleteTaskLinkTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to delete task link");
  }
}
