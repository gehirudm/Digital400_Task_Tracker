import { gql } from "@apollo/client";

export const TASKS_QUERY = gql`
  query Tasks($status: String, $projectId: String) {
    tasks(status: $status, projectId: $projectId) {
      id
      title
      description
      status
      priority
      dueDate
      sortOrder
      assignee {
        id
        name
        email
        avatarUrl
      }
      project {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      sortOrder
      assignee {
        id
        name
        email
        avatarUrl
      }
      project {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: String!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      sortOrder
      assignee {
        id
        name
        email
        avatarUrl
      }
      project {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: String!) {
    deleteTask(id: $id)
  }
`;

export const MOVE_TASK = gql`
  mutation MoveTask($id: String!, $status: String!, $sortOrder: Int!) {
    moveTask(id: $id, status: $status, sortOrder: $sortOrder) {
      id
      title
      status
      priority
      sortOrder
    }
  }
`;
