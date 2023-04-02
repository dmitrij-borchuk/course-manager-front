import { fetchAttendancesForGroups } from './api'
import * as collectionModule from '../../api/firebase/collections'
import { asMock } from 'utils/test'

jest.mock('../../api/firebase/collections')

const { makeOrgCollection } = asMock(collectionModule)
describe('fetchAttendancesForGroups', function () {
  beforeEach(() => {
    makeOrgCollection.mockReturnValue({
      query: jest.fn().mockResolvedValue([]),
      delete: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      queryMulti: jest.fn().mockResolvedValue([]),
      save: jest.fn(),
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
