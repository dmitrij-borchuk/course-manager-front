import gql from 'graphql-tag'

export const createUser = gql`
  mutation CreateUser($input: createUserInput) {
    createUser(input: $input) {
      user {
        id
        role {
          id
          name
        }
        username
      }
    }
  }
`
