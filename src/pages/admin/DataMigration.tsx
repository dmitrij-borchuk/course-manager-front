import { Divider } from 'react-materialize'
import { OrganizationMigration } from './OrganizationMigration'
import { StudentsMigration } from './StudentsMigration'
import { UsersMigration } from './UsersMigration'

export const DataMigration = () => {
  return (
    <div className="container px-4">
      <h1>Data Migration</h1>
      <UsersMigration />

      <div className="my-3">
        <Divider />
      </div>

      <OrganizationMigration />

      <div className="my-3">
        <Divider />
      </div>

      <StudentsMigration />
    </div>
  )
}

export default DataMigration
