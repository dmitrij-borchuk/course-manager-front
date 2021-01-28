import gql from 'graphql-tag'

export const queryAll = gql`
  query Attendances($where: JSON) {
    attendances(where: $where) {
      id
      group {
        id
        name
      }
      date
      student {
        id
        name
      }
    }
  }
`
