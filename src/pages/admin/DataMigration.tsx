import { Divider } from 'react-materialize'
import { Helmet } from 'react-helmet'
import { OrganizationMigration } from './OrganizationMigration'
import { StudentsMigration } from './StudentsMigration'
import { GroupsMigration } from './GroupsMigration'
import { UsersMigration } from './UsersMigration'
import { TITLE_POSTFIX } from '../../config'
import { RecalculateRates } from './RecalculateRates'

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

      <div className="my-3">
        <Divider />
      </div>

      <StudentsMigration />

      <div className="my-3">
        <Divider />
      </div>

      <GroupsMigration />

      <div className="my-3">
        <Divider />
      </div>

      <RecalculateRates />
    </div>
  )
}

export default DataMigration
