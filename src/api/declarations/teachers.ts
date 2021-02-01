import gql from 'graphql-tag'

export const queryAll = gql`
  query Teachers {
    teachers {
      id
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
