import gql from 'graphql-tag'

export const queryAll = gql`
  query Students {
    students {
      id
      name
      description
      groups {
        id
        name
      }
    }
  }
`

export const queryOneStudent = gql`
  query Student($id: ID!) {
    student(id: $id) {
      id
      name
      description
      groups {
        id
        name
      }
    }
  }
`
