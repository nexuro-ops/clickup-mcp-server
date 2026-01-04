import axios, { AxiosInstance } from "axios";
import { logger } from "../../logger.js";
import { ClickUpTask } from "../../types.js";

export class TaskService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async createTask(taskData: any): Promise<any> {
    // Ensure list_id is present before making the call
    if (!taskData.list_id) {
      throw new Error("list_id is required to create a task.");
    }
    logger.debug(`Creating task in list ${taskData.list_id}: ${taskData.name}`);
    try {
      const response = await this.client.post<any>(
        `/v2/list/${taskData.list_id}/task`,
        taskData,
        {},
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error creating task: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error creating task: ${error.message}`);
      }
      throw new Error("Failed to create task in ClickUp");
    }
  }

  async updateTask(
    taskId: string,
    updates: any,
  ): Promise<any> {
    logger.debug(`Updating task ${taskId}`);
    try {
      const response = await this.client.put<any>(
        `/v2/task/${taskId}`,
        updates,
        {},
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error updating task ${taskId}: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error updating task ${taskId}: ${error.message}`);
      }
      throw new Error("Failed to update task in ClickUp");
    }
  }

  async getTask(taskId: string): Promise<any> {
    logger.debug(`Getting task ${taskId}`);
    try {
      const response = await this.client.get<any>(`/v2/task/${taskId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error getting task ${taskId}: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error getting task ${taskId}: ${error.message}`);
      }
      throw new Error("Failed to get task from ClickUp");
    }
  }

  async getTasks(listId: string, params?: any): Promise<any> {
    logger.debug(`Getting tasks for list ${listId}`);
    try {
      const response = await this.client.get<any>(
        `/v2/list/${listId}/task`,
        { params },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error getting tasks for list ${listId}: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error getting tasks for list ${listId}: ${error.message}`);
      }
      throw new Error("Failed to get tasks from ClickUp");
    }
  }

  async deleteTask(taskId: string): Promise<any> {
    logger.debug(`Deleting task ${taskId}`);
    try {
      const response = await this.client.delete<any>(`/v2/task/${taskId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error deleting task ${taskId}: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error deleting task ${taskId}: ${error.message}`);
      }
      throw new Error("Failed to delete task from ClickUp");
    }
  }
}
