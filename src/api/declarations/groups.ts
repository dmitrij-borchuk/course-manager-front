import gql from 'graphql-tag'

export const queryAll = gql`
  query Groups {
    groups {
      id
      name
      teacher {
        id
        name
      }
      students {
        id
        name
      }
    }
  }
`
