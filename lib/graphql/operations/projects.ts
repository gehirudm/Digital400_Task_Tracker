import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!) {
    createProject(name: $name) {
      id
      name
      owner {
        id
        name
        email
      }
      createdAt
    }
  }
`;

export const PROJECTS_QUERY = gql`
  query Projects {
    projects {
      id
      name
      owner {
        id
        name
        email
      }
      tasks {
        id
        title
        status
      }
      createdAt
      updatedAt
    }
  }
`;
