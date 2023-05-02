import { fireEvent, render, screen } from '@testing-library/react'
import { TestWrapper } from 'utils/test'
import { FilterField } from './FilterField'

describe('FilterField', () => {
  it('should call onChange', async () => {
    const onChange = jest.fn()
    render(
      <TestWrapper>
        <FilterField onChange={onChange} />
      </TestWrapper>
    )

    const input = await screen.findByLabelText('Filter')
    fireEvent.change(input, { target: { value: 'some filter' } })

    expect(onChange).toHaveBeenCalledWith('some filter')
  })
  it('should be able to clear filter', async () => {
    const onChange = jest.fn()
    render(
      <TestWrapper>
        <FilterField onChange={onChange} />
      </TestWrapper>
    )

    const input = await screen.findByLabelText('Filter')
    fireEvent.change(input, { target: { value: 'some filter' } })
    expect(onChange).toHaveBeenCalledWith('some filter')
    await (await screen.findByLabelText(/clear filter/)).click()

    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenCalledWith('')
  })
  it('should call onDebouncedChange', async () => {
    const onDebouncedChange = jest.fn()
    render(
      <TestWrapper>
        <FilterField onDebouncedChange={onDebouncedChange} />
      </TestWrapper>
    )

    const input = await screen.findByLabelText('Filter')
    fireEvent.change(input, { target: { value: 'some filter' } })

    // TODO: mock timer
    await wait(301)

    expect(onDebouncedChange).toHaveBeenCalledWith('some filter')
  })
})

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
