import * as common from './common'

describe('groupBy', () => {
  test('should return an empty object when empty array is passed', () => {
    let result: any = common.groupBy([], () => 'd')
    expect(result).toEqual({})
  })

  test('should return a grouped object', () => {
    let param1: any = [{ d: 1 }, { d: 2 }, { d: 3 }]
    let result: any = common.groupBy(param1, 'd')
    expect(result).toEqual({ 1: [{ d: 1 }], 2: [{ d: 2 }], 3: [{ d: 3 }] })
  })

  test('should not group by prop that is not string or number', () => {
    let value: any = new Date()
    let param1: any = [{ d: value }, { d: 1 }]
    let result: any = common.groupBy(param1, 'd')
    expect(result).toEqual({ 1: [{ d: 1 }] })
  })

  test('should be able to groups by predicate', () => {
    let value: any = new Date()
    let param1: any = [{ d: value }]
    let result: any = common.groupBy(param1, (d: any) => d.d.getTime())
    expect(result).toEqual({ [value.getTime()]: param1 })
  })
})

describe('getDiff', () => {
  test('should return an empty arrays when passed two empty arrays', () => {
    let result: any = common.getDiff([], [])
    expect(result).toEqual({ added: [], removed: [] })
  })

  test('should return what was added', () => {
    let result: any = common.getDiff([], ['str1', 'str2'])
    expect(result).toEqual({ added: ['str1', 'str2'], removed: [] })
  })

  test('should return what removed', () => {
    let result: any = common.getDiff(['str1', 'str2'], [])
    expect(result).toEqual({ added: [], removed: ['str1', 'str2'] })
  })

  test('should return what added and removed', () => {
    let result: any = common.getDiff(['str1', 'str2'], ['str3', 'str2'])
    expect(result).toEqual({ added: ['str3'], removed: ['str1'] })
  })

  test('should return empty arrays when nothing changed', () => {
    let result: any = common.getDiff(['str1', 'str2'], ['str1', 'str2'])
    expect(result).toEqual({ added: [], removed: [] })
  })
})
