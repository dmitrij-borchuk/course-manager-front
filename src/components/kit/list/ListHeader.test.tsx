import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { ListHeader } from './ListHeader'

const item: ListHeaderProps['items'][number] = {
  id: 'id',
  label: 'label',
  sortable: true,
}
describe('ListHeader', () => {
  it('should not fail', () => {
    render(<ListHeader items={[item]} />)
  })
  it('should call sort callback', async () => {
    const onSort = jest.fn()
    render(<ListHeader items={[item]} onSort={onSort} />)

    await userEvent.click(screen.getByText(item.label?.toString() || ''))

    expect(onSort).toHaveBeenCalled()
  })
  it('should call sort callback with appropriate argument', async () => {
    const onSort = jest.fn()
    const { rerender } = render(<ListHeader items={[item]} onSort={onSort} sortId="id" />)

    await userEvent.click(screen.getByText(item.label?.toString() || ''))
    expect(onSort).toHaveBeenCalledWith('id', 'asc')

    onSort.mockClear()
    rerender(<ListHeader items={[item]} onSort={onSort} sortId="id" sortOrder="asc" />)
    await userEvent.click(screen.getByText(item.label?.toString() || ''))
    expect(onSort).toHaveBeenCalledWith('id', 'desc')
  })
})

type ListHeaderProps = ComponentProps<typeof ListHeader>
