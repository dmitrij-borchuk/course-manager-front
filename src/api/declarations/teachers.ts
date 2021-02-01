import gql from 'graphql-tag'

export const queryAll = gql`
  query Teachers {
    teachers {
      id
      name
      avatar {
        url
      }
      description
    }
  }
`

export const queryOneTeacher = gql`
  query Teacher($id: ID!) {
    teacher(id: $id) {
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
  mutation CreateTeacher($input: createTeacherInput) {
    createTeacher(input: $input) {
      teacher {
        id
        name
        description
      }
    }
  }
`
