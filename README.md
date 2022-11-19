# Attendance manager

## Architecture

TODO: uml

## Development

We are using https://www.conventionalcommits.org/en/v1.0.0/#specification

## Testing

TODO: write about Cypress
Test users (todo: check it):
`Admin`:

```
Login: test.admin@domain.com
Password: test.admin
```

`Teacher`:

```
Login: test.teacher@domain.com
Password: test.teacher
```

Test strategies:

- CRUD:
  - Create
    - Success
    - Error
      - Validation
      - Conflict
  - Read (render)
    - Empty list
    - Not existing
    - One
    - Multiple
    - Min info
    - Max info
  - Update
    - Success
    - Error
      - Validation
  - Delete

### Cypress env vars

One of the easiest way to use env vars in Cypress is to create `cypress.env.json` file in the project root (https://docs.cypress.io/api/cypress-api/env#Syntax)

Variables that we use in Cypress:

`TEST_UID`: UID of the firebase user to use with testing as a default user<br />
`FIREBASE_API_KEY`: Firebase API_KEY<br />
`FIREBASE_PROJECT_ID`: Firebase PROJECT_ID<br />
`FIREBASE_MESSAGING_SENDER_ID`: Firebase MESSAGING_SENDER_ID<br />
`FIREBASE_APP_ID`: Firebase APP_ID<br />
`FIREBASE_MEASUREMENT_ID`: Firebase MEASUREMENT_ID<br />
`SERVER_URL`: Backend URL, we need it to be able to call it directly for simplifying some test cases (e.g. `http://localhost:4000`)<br />

## Configuration

### Environment variables

`REACT_APP_ENVIRONMENT`: [production, development, test]<br />
`REACT_APP_FIREBASE_API_KEY`: Firebase API_KEY<br />
`REACT_APP_FIREBASE_PROJECT_ID`: Firebase PROJECT_ID<br />
`REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Firebase MESSAGING_SENDER_ID<br />
`REACT_APP_FIREBASE_APP_ID`: Firebase APP_ID<br />
`REACT_APP_FIREBASE_MEASUREMENT_ID`: Firebase MEASUREMENT_ID<br />

## TODO

- Add test to access 404 organization
- Add test to access organization without invite
