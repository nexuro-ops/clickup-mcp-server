#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { ClickUpService } from "./services/clickup.service.js";
import { config } from "./config/app.config.js";
import { logger } from "./logger.js";
import {
  ClickUpTask,
  ClickUpBoard,
  GetSpacesParams,
  CreateSpaceParams,
  UpdateSpaceParams,
  GetFoldersParams,
  CreateFolderParams,
  UpdateFolderParams,
  GetCustomFieldsParams,
  ClickUpCustomField,
  SetTaskCustomFieldValueParams,
  RemoveTaskCustomFieldValueParams,
  SearchDocsParams,
  ClickUpDoc,
  CreateDocParams,
  GetDocPagesParams,
  ClickUpDocPage,
  CreateDocPageParams,
  GetDocPageContentParams,
  EditDocPageContentParams,
  // View Types (import only needed types here)
  // ClickUpView, GetViewsParams, ClickUpViewParentType, CreateViewParams, ...
  ClickUpViewParentType,
  ClickUpViewType,
} from "./types.js";
// Import tool definitions and handlers
import {
  createTaskTool,
  updateTaskTool,
  getTaskTool,
  getTasksTool,
  deleteTaskTool,
  handleCreateTask,
  handleUpdateTask,
  handleGetTask,
  handleGetTasks,
  handleDeleteTask,
} from "./tools/task.tools.js";
import {
  getSpacesTool,
  createSpaceTool,
  getSpaceTool,
  updateSpaceTool,
  deleteSpaceTool,
  handleGetSpaces,
  handleCreateSpace,
  handleGetSpace,
  handleUpdateSpace,
  handleDeleteSpace,
} from "./tools/space.tools.js";
import {
  getFoldersTool,
  createFolderTool,
  getFolderTool,
  updateFolderTool,
  deleteFolderTool,
  handleGetFolders,
  handleCreateFolder,
  handleGetFolder,
  handleUpdateFolder,
  handleDeleteFolder,
} from "./tools/folder.tools.js";
import {
  getCustomFieldsTool,
  setTaskCustomFieldValueTool,
  removeTaskCustomFieldValueTool,
  handleGetCustomFields,
  handleSetTaskCustomFieldValue,
  handleRemoveTaskCustomFieldValue,
} from "./tools/custom-field.tools.js";
import {
  searchDocsTool,
  createDocTool,
  getDocPagesTool,
  createDocPageTool,
  getDocPageContentTool,
  editDocPageContentTool,
  handleSearchDocs,
  handleCreateDoc,
  handleGetDocPages,
  handleCreateDocPage,
  handleGetDocPageContent,
  handleEditDocPageContent,
} from "./tools/doc.tools.js";
import {
  getViewsTool,
  createViewTool,
  getViewDetailsTool,
  updateViewTool,
  deleteViewTool,
  getViewTasksTool,
  handleGetViews,
  handleCreateView,
  handleGetViewDetails,
  handleUpdateView,
  handleDeleteView,
  handleGetViewTasks,
} from "./tools/view.tools.js";
// Import NEW tools/handlers
import { getTeamsTool, handleGetTeams } from "./tools/team.tools.js";
import {
  getListsTool,
  handleGetLists,
  createListTool,
  handleCreateList,
} from "./tools/list.tools.js";
import { createBoardTool, handleCreateBoard } from "./tools/board.tools.js";
import {
  createCommentTool,
  getCommentsTool,
  updateCommentTool,
  deleteCommentTool,
  handleCreateComment,
  handleGetComments,
  handleUpdateComment,
  handleDeleteComment,
} from "./tools/comment.tools.js";
import {
  createTimeEntryTool,
  getTimeEntriesTool,
  updateTimeEntryTool,
  deleteTimeEntryTool,
  startTimerTool,
  stopTimerTool,
  getCurrentTimerTool,
  handleCreateTimeEntry,
  handleGetTimeEntries,
  handleUpdateTimeEntry,
  handleDeleteTimeEntry,
  handleStartTimer,
  handleStopTimer,
  handleGetCurrentTimer,
} from "./tools/time-tracking.tools.js";
import {
  createChecklistTool,
  updateChecklistTool,
  deleteChecklistTool,
  createChecklistItemTool,
  updateChecklistItemTool,
  deleteChecklistItemTool,
  handleCreateChecklist,
  handleUpdateChecklist,
  handleDeleteChecklist,
  handleCreateChecklistItem,
  handleUpdateChecklistItem,
  handleDeleteChecklistItem,
} from "./tools/checklist.tools.js";
import {
  addDependencyTool,
  deleteDependencyTool,
  addTaskLinkTool,
  deleteTaskLinkTool,
  handleAddDependency,
  handleDeleteDependency,
  handleAddTaskLink,
  handleDeleteTaskLink,
} from "./tools/dependency.tools.js";
import {
  uploadAttachmentTool,
  deleteAttachmentTool,
  handleUploadAttachment,
  handleDeleteAttachment,
} from "./tools/attachment.tools.js";
import {
  getChannelsTool,
  createChannelTool,
  getChannelTool,
  updateChannelTool,
  deleteChannelTool,
  getChannelFollowersTool,
  getChannelMembersTool,
  createMessageTool,
  getMessagesTool,
  updateMessageTool,
  deleteMessageTool,
  getDirectMessagesTool,
  getConversationMessagesTool,
  createDirectMessageTool,
  createMessageReactionTool,
  getMessageReactionsTool,
  deleteMessageReactionTool,
  createReplyTool,
  getRepliesTool,
  getMentionableUsersTool,
  handleGetChannels,
  handleCreateChannel,
  handleGetChannel,
  handleUpdateChannel,
  handleDeleteChannel,
  handleGetChannelFollowers,
  handleGetChannelMembers,
  handleCreateMessage,
  handleGetMessages,
  handleUpdateMessage,
  handleDeleteMessage,
  handleGetDirectMessages,
  handleGetConversationMessages,
  handleCreateDirectMessage,
  handleCreateMessageReaction,
  handleGetMessageReactions,
  handleDeleteMessageReaction,
  handleCreateReply,
  handleGetReplies,
  handleGetMentionableUsers,
} from "./tools/chat.tools.js";

// Tool Schemas - REMOVE taskSchema definition if only used in task.tools.ts
const commonIdDescription =
  "The unique identifier for the resource in ClickUp.";
const teamIdDescription = "The ID of the Workspace (Team) to operate on.";
const spaceIdDescription = "The ID of the Space to operate on.";
const folderIdDescription = "The ID of the Folder to operate on.";
const archivedDescription =
  "Whether to include archived items (true or false).";

// Tool Definitions - REMOVE createTaskTool and updateTaskTool
// const createTaskTool: Tool = { ... };
// const updateTaskTool: Tool = { ... };

// Keep main function structure
async function main() {
  try {
    logger.info("Starting ClickUp MCP Server...");
    const clickUpService = new ClickUpService();

    // Define tools registry
    const toolsRegistry = {
      // Task tools
      createTaskTool,
      updateTaskTool,
      getTaskTool,
      getTasksTool,
      deleteTaskTool,
      // Team tools
      getTeamsTool,
      // List tools
      getListsTool,
      createListTool,
      // Board tools
      createBoardTool,
      // Space tools
      getSpacesTool,
      createSpaceTool,
      getSpaceTool,
      updateSpaceTool,
      deleteSpaceTool,
      // Folder tools
      getFoldersTool,
      createFolderTool,
      getFolderTool,
      updateFolderTool,
      deleteFolderTool,
      // Custom field tools
      getCustomFieldsTool,
      setTaskCustomFieldValueTool,
      removeTaskCustomFieldValueTool,
      // Doc tools
      searchDocsTool,
      createDocTool,
      getDocPagesTool,
      createDocPageTool,
      getDocPageContentTool,
      editDocPageContentTool,
      // View tools
      getViewsTool,
      createViewTool,
      getViewDetailsTool,
      updateViewTool,
      deleteViewTool,
      getViewTasksTool,
      // Comment tools
      createCommentTool,
      getCommentsTool,
      updateCommentTool,
      deleteCommentTool,
      // Time tracking tools
      createTimeEntryTool,
      getTimeEntriesTool,
      updateTimeEntryTool,
      deleteTimeEntryTool,
      startTimerTool,
      stopTimerTool,
      getCurrentTimerTool,
      // Checklist tools
      createChecklistTool,
      updateChecklistTool,
      deleteChecklistTool,
      createChecklistItemTool,
      updateChecklistItemTool,
      deleteChecklistItemTool,
      // Dependency tools
      addDependencyTool,
      deleteDependencyTool,
      addTaskLinkTool,
      deleteTaskLinkTool,
      // Attachment tools
      uploadAttachmentTool,
      deleteAttachmentTool,
      // Chat tools
      getChannelsTool,
      createChannelTool,
      getChannelTool,
      updateChannelTool,
      deleteChannelTool,
      getChannelFollowersTool,
      getChannelMembersTool,
      createMessageTool,
      getMessagesTool,
      updateMessageTool,
      deleteMessageTool,
      getDirectMessagesTool,
      getConversationMessagesTool,
      createDirectMessageTool,
      createMessageReactionTool,
      getMessageReactionsTool,
      deleteMessageReactionTool,
      createReplyTool,
      getRepliesTool,
      getMentionableUsersTool,
    };

    const server = new Server(
      {
        name: "ClickUp MCP Server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    // Handle ListTools request
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      // Convert tools registry to Tool array
      const toolDefinitions: Tool[] = Object.values(toolsRegistry);
      return { tools: toolDefinitions };
    });

    // Handle tool calls
    server.setRequestHandler(
      CallToolRequestSchema,
      async (request: CallToolRequest) => {
        logger.debug("Received tool request:", request);
        try {
          const args = request.params.arguments ?? {};
          switch (request.params.name) {
            // Task tools
            case createTaskTool.name:
              return await handleCreateTask(clickUpService, args);
            case updateTaskTool.name:
              return await handleUpdateTask(clickUpService, args);
            case getTaskTool.name:
              return await handleGetTask(clickUpService, args);
            case getTasksTool.name:
              return await handleGetTasks(clickUpService, args);
            case deleteTaskTool.name:
              return await handleDeleteTask(clickUpService, args);
            case getSpacesTool.name:
              return await handleGetSpaces(clickUpService, args);
            case createSpaceTool.name:
              return await handleCreateSpace(clickUpService, args);
            case getSpaceTool.name:
              return await handleGetSpace(clickUpService, args);
            case updateSpaceTool.name:
              return await handleUpdateSpace(clickUpService, args);
            case deleteSpaceTool.name:
              return await handleDeleteSpace(clickUpService, args);
            case getFoldersTool.name:
              return await handleGetFolders(clickUpService, args);
            case createFolderTool.name:
              return await handleCreateFolder(clickUpService, args);
            case getFolderTool.name:
              return await handleGetFolder(clickUpService, args);
            case updateFolderTool.name:
              return await handleUpdateFolder(clickUpService, args);
            case deleteFolderTool.name:
              return await handleDeleteFolder(clickUpService, args);
            case getCustomFieldsTool.name:
              return await handleGetCustomFields(clickUpService, args);
            case setTaskCustomFieldValueTool.name:
              return await handleSetTaskCustomFieldValue(clickUpService, args);
            case removeTaskCustomFieldValueTool.name:
              return await handleRemoveTaskCustomFieldValue(
                clickUpService,
                args,
              );
            case searchDocsTool.name:
              return await handleSearchDocs(clickUpService, args);
            case createDocTool.name:
              return await handleCreateDoc(clickUpService, args);
            case getDocPagesTool.name:
              return await handleGetDocPages(clickUpService, args);
            case createDocPageTool.name:
              return await handleCreateDocPage(clickUpService, args);
            case getDocPageContentTool.name:
              return await handleGetDocPageContent(clickUpService, args);
            case editDocPageContentTool.name:
              return await handleEditDocPageContent(clickUpService, args);
            case getViewsTool.name:
              return await handleGetViews(clickUpService, args);
            case createViewTool.name:
              return await handleCreateView(clickUpService, args);
            case getViewDetailsTool.name:
              return await handleGetViewDetails(clickUpService, args);
            case updateViewTool.name:
              return await handleUpdateView(clickUpService, args);
            case deleteViewTool.name:
              return await handleDeleteView(clickUpService, args);
            case getViewTasksTool.name:
              return await handleGetViewTasks(clickUpService, args);

            // Team tools
            case getTeamsTool.name:
              return await handleGetTeams(clickUpService, args);
            // List tools
            case getListsTool.name:
              return await handleGetLists(clickUpService, args);
            case createListTool.name:
              return await handleCreateList(clickUpService, args);
            // Board tools
            case createBoardTool.name:
              return await handleCreateBoard(clickUpService, args);
            // Comment tools
            case createCommentTool.name:
              return await handleCreateComment(clickUpService, args);
            case getCommentsTool.name:
              return await handleGetComments(clickUpService, args);
            case updateCommentTool.name:
              return await handleUpdateComment(clickUpService, args);
            case deleteCommentTool.name:
              return await handleDeleteComment(clickUpService, args);
            // Time tracking tools
            case createTimeEntryTool.name:
              return await handleCreateTimeEntry(clickUpService, args);
            case getTimeEntriesTool.name:
              return await handleGetTimeEntries(clickUpService, args);
            case updateTimeEntryTool.name:
              return await handleUpdateTimeEntry(clickUpService, args);
            case deleteTimeEntryTool.name:
              return await handleDeleteTimeEntry(clickUpService, args);
            case startTimerTool.name:
              return await handleStartTimer(clickUpService, args);
            case stopTimerTool.name:
              return await handleStopTimer(clickUpService, args);
            case getCurrentTimerTool.name:
              return await handleGetCurrentTimer(clickUpService, args);
            // Checklist tools
            case createChecklistTool.name:
              return await handleCreateChecklist(clickUpService, args);
            case updateChecklistTool.name:
              return await handleUpdateChecklist(clickUpService, args);
            case deleteChecklistTool.name:
              return await handleDeleteChecklist(clickUpService, args);
            case createChecklistItemTool.name:
              return await handleCreateChecklistItem(clickUpService, args);
            case updateChecklistItemTool.name:
              return await handleUpdateChecklistItem(clickUpService, args);
            case deleteChecklistItemTool.name:
              return await handleDeleteChecklistItem(clickUpService, args);
            // Dependency tools
            case addDependencyTool.name:
              return await handleAddDependency(clickUpService, args);
            case deleteDependencyTool.name:
              return await handleDeleteDependency(clickUpService, args);
            case addTaskLinkTool.name:
              return await handleAddTaskLink(clickUpService, args);
            case deleteTaskLinkTool.name:
              return await handleDeleteTaskLink(clickUpService, args);
            // Attachment tools
            case uploadAttachmentTool.name:
              return await handleUploadAttachment(clickUpService, args);
            case deleteAttachmentTool.name:
              return await handleDeleteAttachment(clickUpService, args);
            // Chat tools
            case getChannelsTool.name:
              return await handleGetChannels(clickUpService, args);
            case createChannelTool.name:
              return await handleCreateChannel(clickUpService, args);
            case getChannelTool.name:
              return await handleGetChannel(clickUpService, args);
            case updateChannelTool.name:
              return await handleUpdateChannel(clickUpService, args);
            case deleteChannelTool.name:
              return await handleDeleteChannel(clickUpService, args);
            case getChannelFollowersTool.name:
              return await handleGetChannelFollowers(clickUpService, args);
            case getChannelMembersTool.name:
              return await handleGetChannelMembers(clickUpService, args);
            case createMessageTool.name:
              return await handleCreateMessage(clickUpService, args);
            case getMessagesTool.name:
              return await handleGetMessages(clickUpService, args);
            case updateMessageTool.name:
              return await handleUpdateMessage(clickUpService, args);
            case deleteMessageTool.name:
              return await handleDeleteMessage(clickUpService, args);
            case getDirectMessagesTool.name:
              return await handleGetDirectMessages(clickUpService, args);
            case getConversationMessagesTool.name:
              return await handleGetConversationMessages(clickUpService, args);
            case createDirectMessageTool.name:
              return await handleCreateDirectMessage(clickUpService, args);
            case createMessageReactionTool.name:
              return await handleCreateMessageReaction(clickUpService, args);
            case getMessageReactionsTool.name:
              return await handleGetMessageReactions(clickUpService, args);
            case deleteMessageReactionTool.name:
              return await handleDeleteMessageReaction(clickUpService, args);
            case createReplyTool.name:
              return await handleCreateReply(clickUpService, args);
            case getRepliesTool.name:
              return await handleGetReplies(clickUpService, args);
            case getMentionableUsersTool.name:
              return await handleGetMentionableUsers(clickUpService, args);

            default:
              throw new Error(`Unknown tool: ${request.params.name}`);
          }
        } catch (error) {
          logger.error("Error handling tool request:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          return {
            content: [{ type: "text", text: `Error: ${errorMessage}` }],
          };
        }
      },
    );

    // Explicitly create and connect the Stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info(
      "ClickUp MCP Server started successfully and listening via Stdio.",
    );
  } catch (error) {
    logger.error("Failed to start ClickUp MCP Server:", error);
    process.exit(1); // Exit with error code
  }
}

main();
