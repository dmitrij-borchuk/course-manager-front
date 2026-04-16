import { mockFn } from '@/utils/tests'
import { asMock } from 'utils/test'
import { fetchAttendancesForGroups } from './api'
import * as collectionModule from '../../api/firebase/collections'

vi.mock('../../api/firebase/collections')

const { makeOrgCollection } = asMock(collectionModule)
describe('fetchAttendancesForGroups', function () {
  beforeEach(() => {
    makeOrgCollection.mockReturnValue({
      query: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
      getAll: vi.fn(),
      getById: vi.fn(),
      queryMulti: vi.fn().mockResolvedValue([]),
      save: vi.fn(),
    })
  })
  it('result should be cached and returned', async function () {
    await fetchAttendancesForGroups('orgKey', ['groupId1'])
    expect(makeOrgCollection).toHaveBeenCalledTimes(1)
    await fetchAttendancesForGroups('orgKey', ['groupId2'])
    expect(makeOrgCollection).toHaveBeenCalledTimes(2)
    await fetchAttendancesForGroups('orgKey', ['groupId1'])
    expect(makeOrgCollection).toHaveBeenCalledTimes(2)
  })
})
