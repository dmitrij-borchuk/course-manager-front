import gql from "graphql-tag";

export const queryAll = gql`
  query Students {
    students {
      id
    }
  }
`;
