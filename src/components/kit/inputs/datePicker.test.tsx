import { fireEvent, render } from '@testing-library/react'
import { getDatePickerInputByLabel } from '@/libs/tests'
import { TestWrapper } from 'utils/test'
import { DatePicker } from './datePicker'

describe('DatePicker', () => {
  const defaultProps = {
    defaultValue: new Date(),
    onChange: vi.fn(),
  }
  const setup = (props = {}) => {
    return render(
      <TestWrapper>
        <DatePicker label="Test label" {...defaultProps} {...props} />
      </TestWrapper>
    )
  }
  test('should render without crashing', async () => {
    setup()
    await getDatePickerInputByLabel('Test label')
  })
  test('should call onChange', async () => {
    setup()
    const input = await getDatePickerInputByLabel('Test label')

    fireEvent.change(input, { target: { value: '05/22/2022' } })
    expect(defaultProps.onChange).toHaveBeenCalled()
    const date = defaultProps.onChange.mock.lastCall?.[0]
    expect(date.toLocaleDateString()).toBe(new Date('05/22/2022').toLocaleDateString())
  })
})
