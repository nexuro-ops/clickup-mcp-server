import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ClickUpService } from "../services/clickup.service.js";
import { logger } from "../logger.js";

export const createTimeEntryTool: Tool = {
  name: "clickup_create_time_entry",
  description: "Create a time entry for a ClickUp task",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The unique identifier of the task.",
      },
      duration: {
        type: "number",
        description: "Duration in milliseconds.",
      },
      start: {
        type: "number",
        description: "Start time in Unix milliseconds (optional, defaults to now - duration).",
      },
      description: {
        type: "string",
        description: "Optional description of the time entry.",
      },
    },
    required: ["task_id", "duration"],
  },
  outputSchema: {
    type: "object",
    properties: {
      data: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The created time entry.",
  },
};

export const getTimeEntriesTool: Tool = {
  name: "clickup_get_time_entries",
  description: "Get all time entries for a ClickUp task",
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
      data: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    description: "An array of time entries.",
  },
};

export const updateTimeEntryTool: Tool = {
  name: "clickup_update_time_entry",
  description: "Update a time entry in ClickUp",
  inputSchema: {
    type: "object",
    properties: {
      team_id: {
        type: "string",
        description: "The unique identifier of the team/workspace.",
      },
      timer_id: {
        type: "string",
        description: "The unique identifier of the time entry.",
      },
      duration: {
        type: "number",
        description: "Duration in milliseconds.",
      },
      start: {
        type: "number",
        description: "Start time in Unix milliseconds.",
      },
      description: {
        type: "string",
        description: "Optional description of the time entry.",
      },
    },
    required: ["team_id", "timer_id", "duration"],
  },
  outputSchema: {
    type: "object",
    properties: {
      data: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The updated time entry.",
  },
};

export const deleteTimeEntryTool: Tool = {
  name: "clickup_delete_time_entry",
  description: "Delete a time entry from ClickUp",
  inputSchema: {
    type: "object",
    properties: {
      team_id: {
        type: "string",
        description: "The unique identifier of the team/workspace.",
      },
      timer_id: {
        type: "string",
        description: "The unique identifier of the time entry.",
      },
    },
    required: ["team_id", "timer_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
      },
    },
    description: "Confirmation of time entry deletion.",
  },
};

export const startTimerTool: Tool = {
  name: "clickup_start_timer",
  description: "Start a timer for a ClickUp task",
  inputSchema: {
    type: "object",
    properties: {
      team_id: {
        type: "string",
        description: "The unique identifier of the team/workspace.",
      },
      task_id: {
        type: "string",
        description: "The unique identifier of the task.",
      },
      description: {
        type: "string",
        description: "Optional description for the timer.",
      },
    },
    required: ["team_id", "task_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      data: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The started timer.",
  },
};

export const stopTimerTool: Tool = {
  name: "clickup_stop_timer",
  description: "Stop the currently running timer",
  inputSchema: {
    type: "object",
    properties: {
      team_id: {
        type: "string",
        description: "The unique identifier of the team/workspace.",
      },
    },
    required: ["team_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      data: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The stopped timer.",
  },
};

export const getCurrentTimerTool: Tool = {
  name: "clickup_get_current_timer",
  description: "Get the currently running timer",
  inputSchema: {
    type: "object",
    properties: {
      team_id: {
        type: "string",
        description: "The unique identifier of the team/workspace.",
      },
    },
    required: ["team_id"],
  },
  outputSchema: {
    type: "object",
    properties: {
      data: {
        type: "object",
        additionalProperties: true,
      },
    },
    description: "The current timer.",
  },
};

// Handler functions

export async function handleCreateTimeEntry(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { task_id, duration, start, description } = args as {
    task_id: string;
    duration: number;
    start?: number;
    description?: string;
  };

  if (!task_id || typeof task_id !== "string") {
    throw new Error("Task ID is required and must be a string.");
  }
  if (!duration || typeof duration !== "number") {
    throw new Error("Duration is required and must be a number.");
  }

  const entryData: any = { duration };
  if (start !== undefined) {
    entryData.start = start;
  }
  if (description) {
    entryData.description = description;
  }

  logger.info(`Handling tool call: ${createTimeEntryTool.name} for task ${task_id}`);
  try {
    const response = await clickUpService.timeTrackingService.createTimeEntry(
      task_id,
      entryData,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { data: response.data || response },
    };
  } catch (error) {
    logger.error(`Error in ${createTimeEntryTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to create time entry");
  }
}

export async function handleGetTimeEntries(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { task_id } = args as { task_id: string };

  if (!task_id || typeof task_id !== "string") {
    throw new Error("Task ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${getTimeEntriesTool.name} for task ${task_id}`);
  try {
    const response = await clickUpService.timeTrackingService.getTimeEntries(task_id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { data: response.data || [] },
    };
  } catch (error) {
    logger.error(`Error in ${getTimeEntriesTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to get time entries");
  }
}

export async function handleUpdateTimeEntry(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { team_id, timer_id, duration, start, description } = args as {
    team_id: string;
    timer_id: string;
    duration: number;
    start?: number;
    description?: string;
  };

  if (!team_id || typeof team_id !== "string") {
    throw new Error("Team ID is required and must be a string.");
  }
  if (!timer_id || typeof timer_id !== "string") {
    throw new Error("Timer ID is required and must be a string.");
  }
  if (!duration || typeof duration !== "number") {
    throw new Error("Duration is required and must be a number.");
  }

  const updateData: any = { duration };
  if (start !== undefined) {
    updateData.start = start;
  }
  if (description) {
    updateData.description = description;
  }

  logger.info(`Handling tool call: ${updateTimeEntryTool.name} for timer ${timer_id}`);
  try {
    const response = await clickUpService.timeTrackingService.updateTimeEntry(
      team_id,
      timer_id,
      updateData,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { data: response.data || response },
    };
  } catch (error) {
    logger.error(`Error in ${updateTimeEntryTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to update time entry");
  }
}

export async function handleDeleteTimeEntry(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { team_id, timer_id } = args as {
    team_id: string;
    timer_id: string;
  };

  if (!team_id || typeof team_id !== "string") {
    throw new Error("Team ID is required and must be a string.");
  }
  if (!timer_id || typeof timer_id !== "string") {
    throw new Error("Timer ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${deleteTimeEntryTool.name} for timer ${timer_id}`);
  try {
    await clickUpService.timeTrackingService.deleteTimeEntry(team_id, timer_id);
    return {
      content: [
        {
          type: "text",
          text: `Time entry ${timer_id} deleted successfully`,
        },
      ],
      structuredContent: { success: true },
    };
  } catch (error) {
    logger.error(`Error in ${deleteTimeEntryTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to delete time entry");
  }
}

export async function handleStartTimer(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { team_id, task_id, description } = args as {
    team_id: string;
    task_id: string;
    description?: string;
  };

  if (!team_id || typeof team_id !== "string") {
    throw new Error("Team ID is required and must be a string.");
  }
  if (!task_id || typeof task_id !== "string") {
    throw new Error("Task ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${startTimerTool.name} for task ${task_id}`);
  try {
    const response = await clickUpService.timeTrackingService.startTimer(
      team_id,
      task_id,
      description,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { data: response.data || response },
    };
  } catch (error) {
    logger.error(`Error in ${startTimerTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to start timer");
  }
}

export async function handleStopTimer(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { team_id } = args as { team_id: string };

  if (!team_id || typeof team_id !== "string") {
    throw new Error("Team ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${stopTimerTool.name} for team ${team_id}`);
  try {
    const response = await clickUpService.timeTrackingService.stopTimer(team_id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { data: response.data || response },
    };
  } catch (error) {
    logger.error(`Error in ${stopTimerTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to stop timer");
  }
}

export async function handleGetCurrentTimer(
  clickUpService: ClickUpService,
  args: Record<string, unknown>,
) {
  const { team_id } = args as { team_id: string };

  if (!team_id || typeof team_id !== "string") {
    throw new Error("Team ID is required and must be a string.");
  }

  logger.info(`Handling tool call: ${getCurrentTimerTool.name} for team ${team_id}`);
  try {
    const response = await clickUpService.timeTrackingService.getCurrentTimer(team_id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
      structuredContent: { data: response.data || response },
    };
  } catch (error) {
    logger.error(`Error in ${getCurrentTimerTool.name}:`, error);
    throw error instanceof Error ? error : new Error("Failed to get current timer");
  }
}
