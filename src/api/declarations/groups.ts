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

export const queryOneGroup = gql`
  query Group($id: ID!) {
    group(id: $id) {
      id
      name
      description
      teacher {
        id
        name
        avatar {
          url
        }
      }
      students {
        id
        name
      }
    }
  }
`
