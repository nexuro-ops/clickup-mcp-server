import axios, { AxiosInstance } from "axios";
import { logger } from "../../logger.js";

export class CommentService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async createComment(taskId: string, commentData: any): Promise<any> {
    logger.debug(`Creating comment on task ${taskId}`);
    try {
      const response = await this.client.post<any>(
        `/v2/task/${taskId}/comment`,
        commentData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error creating comment: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error creating comment: ${error.message}`);
      }
      throw new Error("Failed to create comment in ClickUp");
    }
  }

  async getComments(taskId: string): Promise<any> {
    logger.debug(`Getting comments for task ${taskId}`);
    try {
      const response = await this.client.get<any>(
        `/v2/task/${taskId}/comment`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error getting comments: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error getting comments: ${error.message}`);
      }
      throw new Error("Failed to get comments from ClickUp");
    }
  }

  async updateComment(commentId: string, updateData: any): Promise<any> {
    logger.debug(`Updating comment ${commentId}`);
    try {
      const response = await this.client.put<any>(
        `/v2/comment/${commentId}`,
        updateData,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error updating comment: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error updating comment: ${error.message}`);
      }
      throw new Error("Failed to update comment in ClickUp");
    }
  }

  async deleteComment(commentId: string): Promise<any> {
    logger.debug(`Deleting comment ${commentId}`);
    try {
      const response = await this.client.delete<any>(
        `/v2/comment/${commentId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error deleting comment: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error deleting comment: ${error.message}`);
      }
      throw new Error("Failed to delete comment from ClickUp");
    }
  }
}
