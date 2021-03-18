import gql from 'graphql-tag'

export const queryAll = gql`
  query Teachers($where: JSON) {
    userInfos(where: $where) {
      id
      name
      description
      avatar {
        url
      }
      user {
        id
        email
      }
      groups {
        id
        name
      }
    }
  }
`

export const queryOneTeacher = gql`
  query Teacher($id: ID!) {
    userInfo(id: $id) {
      id
      name
      description
      avatar {
        url
      }
      user {
        id
        email
      }
      groups {
        id
        name
      }
    }
  }
`

export const createTeacher = gql`
  mutation CreateTeacher($input: createUserInfoInput) {
    createUserInfo(input: $input) {
      userInfo {
        id
        name
        description
        avatar {
          id
          url
        }
        groups {
          id
          name
        }
        user {
          id
          email
          role {
            id
            name
          }
        }
      }
    }
  }
`

export const updateTeacher = gql`
  mutation UpdateTeacher($input: updateUserInfoInput) {
    updateUserInfo(input: $input) {
      userInfo {
        id
        name
        description
        avatar {
          id
          url
        }
        groups {
          id
          name
        }
        user {
          id
          email
          role {
            id
            name
          }
        }
      }
    }
  }
`
