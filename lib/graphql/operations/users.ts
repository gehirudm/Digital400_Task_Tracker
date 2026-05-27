import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      avatarUrl
    }
  }
`;

export const USERS_QUERY = gql`
  query Users {
    users {
      id
      name
      email
      avatarUrl
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      email
      avatarUrl
    }
  }
`;
