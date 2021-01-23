import gql from 'graphql-tag'

export const login = gql`
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        id
        email
        role {
          id
          name
        }
        username
      }
    }
  }
`
