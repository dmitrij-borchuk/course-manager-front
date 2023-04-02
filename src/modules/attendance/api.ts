import { Attendance } from 'types/attendance'
import { cacheMemo } from 'utils/cacheMemo'
import { makeOrgCollection } from '../../api/firebase/collections'

export async function fetchAttendance(orgId: string, id: string) {
  const collection = makeOrgCollection<Attendance>('attendances', orgId)
  return await collection.getById(id)
}

export async function fetchAttendancesForGroups(orgKey: string, groupsOuterIds: string[]) {
  const result = await Promise.all(
    groupsOuterIds.map((id) => {
      return getAttendanceByGroupWithCache(orgKey, id)
    })
  )

  return result.flat()
}
function getAttendanceByGroup(orgId: string, groupId: string) {
  const collection = makeOrgCollection<Attendance>('attendances', orgId)
  return collection.query('group', '==', groupId)
}

// Need to use cacheMemo to avoid multiple requests for the same information
const getAttendanceByGroupWithCache = cacheMemo(getAttendanceByGroup)

export async function fetchAttendances(
  orgId: string,
  params: { teacherId?: string; activity?: string; from?: Date; to?: Date }
) {
  const collection = makeOrgCollection<Attendance>('attendances', orgId)
  const config = []
  if (params.from) {
    config.push(['date', '>=', params.from.getTime()] as const)
  }
  if (params.to) {
    config.push(['date', '<=', params.to.getTime()] as const)
  }
  if (params.teacherId) {
    config.push(['teacher', '==', params.teacherId])
  }
  if (params.activity) {
    config.push(['group', '==', params.activity])
  }

  return collection.queryMulti(config as any)
}
