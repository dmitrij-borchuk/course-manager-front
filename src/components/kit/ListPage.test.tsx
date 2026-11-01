import { act, fireEvent, render, screen } from '@testing-library/react'
import * as reactRouter from 'react-router'
import * as reactRouterDom from 'react-router-dom'
import { asMock, TestWrapper } from 'utils/test'
import { ListPage } from './ListPage'

vi.mock('react-router-dom')
vi.mock('react-router')

const { useHistory, useParams } = asMock(reactRouterDom)
const { useLocation } = asMock(reactRouter)

const items = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

describe('ListPage', () => {
  const replaceMock = vi.fn()

  beforeEach(() => {
    replaceMock.mockReset()
    useParams.mockReturnValue({ orgId: 'orgId' })
    useHistory.mockReturnValue({
      push: vi.fn(),
      replace: replaceMock,
      location: { search: '' },
    } as unknown as ReturnType<typeof reactRouterDom.useHistory>)
    useLocation.mockReturnValue({
      search: '',
      pathname: '/students',
      state: undefined,
      hash: '',
    })
  })

  it('initializes filter input from URL query parameter and renders items directly without filtering', async () => {
    useLocation.mockReturnValue({
      search: '?filter=alice',
      pathname: '/students',
      state: undefined,
      hash: '',
    })

    render(
      <TestWrapper>
        <ListPage items={items} itemLinkRoot="/students" labelProp="name" />
      </TestWrapper>
    )

    const input = await screen.findByLabelText('Filter')
    expect(input).toHaveValue('alice')

    const renderedItems = await screen.findAllByTestId('list-link-item')
    expect(renderedItems).toHaveLength(2)
  })

  it('updates URL filter query parameter on debounced filter change', async () => {
    render(
      <TestWrapper>
        <ListPage items={items} itemLinkRoot="/students" labelProp="name" />
      </TestWrapper>
    )

    const input = await screen.findByLabelText('Filter')
    fireEvent.change(input, { target: { value: 'bob' } })
    expect(input).toHaveValue('bob')

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 310))
    })

    expect(replaceMock).toHaveBeenCalledWith({
      search: 'filter=bob',
    })
  })

  it('clears URL filter query parameter when filter is cleared', async () => {
    useLocation.mockReturnValue({
      search: '?filter=alice',
      pathname: '/students',
      state: undefined,
      hash: '',
    })

    render(
      <TestWrapper>
        <ListPage items={items} itemLinkRoot="/students" labelProp="name" />
      </TestWrapper>
    )

    const clearBtn = await screen.findByLabelText(/clear filter/)
    fireEvent.click(clearBtn)

    const input = await screen.findByLabelText('Filter')
    expect(input).toHaveValue('')

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 310))
    })

    expect(replaceMock).toHaveBeenCalledWith({
      search: '',
    })
  })
})

