# Attendance manager

## Architecture

TODO: uml

## Development

We are using https://www.conventionalcommits.org/en/v1.0.0/#specification

## Testing

TODO: Write about firebase emulator

TODO: write about Cypress
Test users:
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

## Configuration

### Environment variables

`REACT_APP_ENVIRONMENT`: [production, development, test]
`REACT_APP_FIREBASE_API_KEY`: Firebase API_KEY
`REACT_APP_FIREBASE_PROJECT_ID`: Firebase PROJECT_ID
`REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Firebase MESSAGING_SENDER_ID
`REACT_APP_FIREBASE_APP_ID`: Firebase APP_ID
`REACT_APP_FIREBASE_MEASUREMENT_ID`: Firebase MEASUREMENT_ID

## TODO

- Add test to access 404 organization
- Add test to access organization without invite
