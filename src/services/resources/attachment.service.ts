import axios, { AxiosInstance } from "axios";
import FormData from "form-data";
import { logger } from "../../logger.js";
import fs from "fs";

export class AttachmentService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async uploadAttachment(
    taskId: string,
    filePath: string,
    fileName?: string,
  ): Promise<any> {
    logger.debug(`Uploading attachment to task ${taskId}`);
    try {
      const formData = new FormData();
      formData.append("attachment", fs.createReadStream(filePath));
      if (fileName) {
        formData.append("filename", fileName);
      }

      const response = await this.client.post<any>(
        `/v2/task/${taskId}/attachment`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error uploading attachment: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error uploading attachment: ${error.message}`);
      }
      throw new Error("Failed to upload attachment in ClickUp");
    }
  }

  async deleteAttachment(attachmentId: string): Promise<any> {
    logger.debug(`Deleting attachment ${attachmentId}`);
    try {
      const response = await this.client.delete<any>(
        `/v2/attachment/${attachmentId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Axios error deleting attachment: ${error.message}`, {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else if (error instanceof Error) {
        logger.error(`Generic error deleting attachment: ${error.message}`);
      }
      throw new Error("Failed to delete attachment from ClickUp");
    }
  }
}
