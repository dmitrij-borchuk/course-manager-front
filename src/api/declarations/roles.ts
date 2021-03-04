import gql from 'graphql-tag'

export const queryAll = gql`
  query Roles {
    roles {
      id
      name
    }
  }
`
