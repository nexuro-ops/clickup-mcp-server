import axios, { AxiosInstance } from "axios";
import { logger } from "../../logger.js";

export class ChecklistService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async createChecklist(taskId: string, checklistData: any): Promise<any> {
    logger.debug(`Creating checklist for task ${taskId}`);
    try {
      const response = await this.client.post<any>(
        `/v2/task/${taskId}/checklist`,
        checklistData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error creating checklist: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error creating checklist: ${error.message}`);
      }
      throw new Error("Failed to create checklist in ClickUp");
    }
  }

  async updateChecklist(checklistId: string, updateData: any): Promise<any> {
    logger.debug(`Updating checklist ${checklistId}`);
    try {
      const response = await this.client.put<any>(
        `/v2/checklist/${checklistId}`,
        updateData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error updating checklist: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error updating checklist: ${error.message}`);
      }
      throw new Error("Failed to update checklist in ClickUp");
    }
  }

  async deleteChecklist(checklistId: string): Promise<any> {
    logger.debug(`Deleting checklist ${checklistId}`);
    try {
      const response = await this.client.delete<any>(
        `/v2/checklist/${checklistId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error deleting checklist: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error deleting checklist: ${error.message}`);
      }
      throw new Error("Failed to delete checklist from ClickUp");
    }
  }

  async createChecklistItem(checklistId: string, itemData: any): Promise<any> {
    logger.debug(`Creating checklist item for checklist ${checklistId}`);
    try {
      const response = await this.client.post<any>(
        `/v2/checklist/${checklistId}/checklist_item`,
        itemData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error creating checklist item: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error creating checklist item: ${error.message}`);
      }
      throw new Error("Failed to create checklist item in ClickUp");
    }
  }

  async updateChecklistItem(
    checklistId: string,
    checklistItemId: string,
    updateData: any,
  ): Promise<any> {
    logger.debug(`Updating checklist item ${checklistItemId}`);
    try {
      const response = await this.client.put<any>(
        `/v2/checklist/${checklistId}/checklist_item/${checklistItemId}`,
        updateData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error updating checklist item: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error updating checklist item: ${error.message}`);
      }
      throw new Error("Failed to update checklist item in ClickUp");
    }
  }

  async deleteChecklistItem(
    checklistId: string,
    checklistItemId: string,
  ): Promise<any> {
    logger.debug(`Deleting checklist item ${checklistItemId}`);
    try {
      const response = await this.client.delete<any>(
        `/v2/checklist/${checklistId}/checklist_item/${checklistItemId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error deleting checklist item: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error deleting checklist item: ${error.message}`);
      }
      throw new Error("Failed to delete checklist item from ClickUp");
    }
  }
}
