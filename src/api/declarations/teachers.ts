import gql from "graphql-tag";

export const queryAll = gql`
  query Teachers {
    teachers {
      id
    }
  }
`;
