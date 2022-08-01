import { Divider } from 'react-materialize'
import { Helmet } from 'react-helmet'
import { OrganizationMigration } from './OrganizationMigration'
import { UsersMigration } from './UsersMigration'
import { TITLE_POSTFIX } from '../../config'

export const DataMigration = () => {
  return (
    <div className="container px-4">
      <Helmet>
        <title>Admin{TITLE_POSTFIX}</title>
      </Helmet>
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
