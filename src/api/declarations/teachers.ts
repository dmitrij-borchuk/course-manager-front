import gql from 'graphql-tag'

export const queryAll = gql`
  query Teachers($where: JSON) {
    users(where: $where) {
      id
      name
      description
      avatar {
        url
      }
    }
  }
`

export const queryOneTeacher = gql`
  query Teacher($id: ID!) {
    user(id: $id) {
      id
      name
      description
      avatar {
        url
      }
      groups {
        id
        name
      }
    }
  }
`

export const createTeacher = gql`
  mutation CreateTeacher($input: createUserInput) {
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
