import { Divider } from 'react-materialize'
import { OrganizationMigration } from './OrganizationMigration'
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
    </div>
  )
}

export default DataMigration
