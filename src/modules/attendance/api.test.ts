import { mockFn } from '@/utils/tests'
import { asMock } from 'utils/test'
import { fetchAttendancesForGroups } from './api'
import * as collectionModule from '../../api/firebase/collections'

jest.mock('../../api/firebase/collections')

const { makeOrgCollection } = asMock(collectionModule)
describe('fetchAttendancesForGroups', function () {
  beforeEach(() => {
    makeOrgCollection.mockReturnValue({
      query: mockFn().mockResolvedValue([]),
      delete: mockFn(),
      getAll: mockFn(),
      getById: mockFn(),
      queryMulti: mockFn().mockResolvedValue([]),
      save: mockFn(),
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
