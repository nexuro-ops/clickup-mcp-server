import axios, { AxiosInstance } from "axios";
import { logger } from "../../logger.js";

export class DependencyService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async addDependency(
    taskId: string,
    dependsOn: string,
    dependencyOf?: string,
  ): Promise<any> {
    logger.debug(`Adding dependency for task ${taskId}`);
    try {
      const data: any = {};
      if (dependsOn) {
        data.depends_on = dependsOn;
      }
      if (dependencyOf) {
        data.dependency_of = dependencyOf;
      }

      const response = await this.client.post<any>(
        `/v2/task/${taskId}/dependency`,
        data,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error adding dependency: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error adding dependency: ${error.message}`);
      }
      throw new Error("Failed to add dependency in ClickUp");
    }
  }

  async deleteDependency(
    taskId: string,
    dependsOn?: string,
    dependencyOf?: string,
  ): Promise<any> {
    logger.debug(`Deleting dependency for task ${taskId}`);
    try {
      const params: any = {};
      if (dependsOn) {
        params.depends_on = dependsOn;
      }
      if (dependencyOf) {
        params.dependency_of = dependencyOf;
      }

      const response = await this.client.delete<any>(
        `/v2/task/${taskId}/dependency`,
        { params },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error deleting dependency: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error deleting dependency: ${error.message}`);
      }
      throw new Error("Failed to delete dependency from ClickUp");
    }
  }

  async addTaskLink(taskId: string, linksTo: string): Promise<any> {
    logger.debug(`Adding task link for task ${taskId} to ${linksTo}`);
    try {
      const response = await this.client.post<any>(
        `/v2/task/${taskId}/link/${linksTo}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error adding task link: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error adding task link: ${error.message}`);
      }
      throw new Error("Failed to add task link in ClickUp");
    }
  }

  async deleteTaskLink(taskId: string, linksTo: string): Promise<any> {
    logger.debug(`Deleting task link for task ${taskId} to ${linksTo}`);
    try {
      const response = await this.client.delete<any>(
        `/v2/task/${taskId}/link/${linksTo}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error deleting task link: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error deleting task link: ${error.message}`);
      }
      throw new Error("Failed to delete task link from ClickUp");
    }
  }
}
