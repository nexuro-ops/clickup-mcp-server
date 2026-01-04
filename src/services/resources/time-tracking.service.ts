import axios, { AxiosInstance } from "axios";
import { logger } from "../../logger.js";

export class TimeTrackingService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async createTimeEntry(taskId: string, entryData: any): Promise<any> {
    logger.debug(`Creating time entry for task ${taskId}`);
    try {
      const response = await this.client.post<any>(
        `/v2/task/${taskId}/time`,
        entryData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error creating time entry: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error creating time entry: ${error.message}`);
      }
      throw new Error("Failed to create time entry in ClickUp");
    }
  }

  async getTimeEntries(taskId: string): Promise<any> {
    logger.debug(`Getting time entries for task ${taskId}`);
    try {
      const response = await this.client.get<any>(`/v2/task/${taskId}/time`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error getting time entries: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error getting time entries: ${error.message}`);
      }
      throw new Error("Failed to get time entries from ClickUp");
    }
  }

  async updateTimeEntry(
    teamId: string,
    timerId: string,
    updateData: any,
  ): Promise<any> {
    logger.debug(`Updating time entry ${timerId}`);
    try {
      const response = await this.client.put<any>(
        `/v2/team/${teamId}/time_entries/${timerId}`,
        updateData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error updating time entry: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error updating time entry: ${error.message}`);
      }
      throw new Error("Failed to update time entry in ClickUp");
    }
  }

  async deleteTimeEntry(teamId: string, timerId: string): Promise<any> {
    logger.debug(`Deleting time entry ${timerId}`);
    try {
      const response = await this.client.delete<any>(
        `/v2/team/${teamId}/time_entries/${timerId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error deleting time entry: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error deleting time entry: ${error.message}`);
      }
      throw new Error("Failed to delete time entry from ClickUp");
    }
  }

  async startTimer(teamId: string, taskId: string, description?: string): Promise<any> {
    logger.debug(`Starting timer for task ${taskId}`);
    try {
      const data: any = { tid: taskId };
      if (description) {
        data.description = description;
      }
      const response = await this.client.post<any>(
        `/v2/team/${teamId}/time_entries/start`,
        data,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error starting timer: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error starting timer: ${error.message}`);
      }
      throw new Error("Failed to start timer in ClickUp");
    }
  }

  async stopTimer(teamId: string): Promise<any> {
    logger.debug(`Stopping timer for team ${teamId}`);
    try {
      const response = await this.client.post<any>(
        `/v2/team/${teamId}/time_entries/stop`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error stopping timer: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error stopping timer: ${error.message}`);
      }
      throw new Error("Failed to stop timer in ClickUp");
    }
  }

  async getCurrentTimer(teamId: string): Promise<any> {
    logger.debug(`Getting current timer for team ${teamId}`);
    try {
      const response = await this.client.get<any>(
        `/v2/team/${teamId}/time_entries/current`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error getting current timer: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error getting current timer: ${error.message}`);
      }
      throw new Error("Failed to get current timer from ClickUp");
    }
  }
}
