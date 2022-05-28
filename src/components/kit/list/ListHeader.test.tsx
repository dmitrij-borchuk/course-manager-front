import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { ListHeader } from './ListHeader'

const items: ListHeaderProps['items'] = [
  {
    id: 'id',
    label: 'label',
    sortable: true,
  },
]
describe('ListHeader', () => {
  it('should not fail', () => {
    render(<ListHeader items={items} />)
  })
  it('should call sort callback', async () => {
    const onSort = jest.fn()
    render(<ListHeader items={items} onSort={onSort} />)

    userEvent.click(screen.getByText(items[0].label?.toString() || ''))

    expect(onSort).toHaveBeenCalled()
  })
  it('should call sort callback with appropriate argument', async () => {
    const onSort = jest.fn()
    const {rerender} = render(<ListHeader items={items} onSort={onSort} sortId="id" />)

    userEvent.click(screen.getByText(items[0].label?.toString() || ''))
    expect(onSort).toHaveBeenCalledWith('id', 'asc')

    onSort.mockClear()
    rerender(<ListHeader items={items} onSort={onSort} sortId="id" sortOrder='asc' />)
    userEvent.click(screen.getByText(items[0].label?.toString() || ''))
    expect(onSort).toHaveBeenCalledWith('id', 'desc')
  })
})

type ListHeaderProps = ComponentProps<typeof ListHeader>
