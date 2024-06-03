import { fireEvent, render, screen } from '@testing-library/react'
import { DatePicker } from './datePicker'
import { TestWrapper } from 'utils/test'

describe('DatePicker', () => {
  const defaultProps = {
    defaultValue: new Date(),
    onChange: jest.fn(),
  }
  const setup = (props = {}) => {
    return render(
      <TestWrapper>
        <DatePicker {...defaultProps} {...props} />
      </TestWrapper>
    )
  }
  test('should render without crashing', async () => {
    setup()
    await screen.findByRole<HTMLInputElement>('textbox')
  })
  test('should call onChange', async () => {
    setup()
    const input = await screen.findByRole<HTMLInputElement>('textbox')

    fireEvent.change(input, { target: { value: '05/22/2022' } })
    expect(defaultProps.onChange).toHaveBeenCalled()
    const date = defaultProps.onChange.mock.lastCall[0]
    expect(date.toLocaleDateString()).toBe(new Date('05/22/2022').toLocaleDateString())
  })
})
