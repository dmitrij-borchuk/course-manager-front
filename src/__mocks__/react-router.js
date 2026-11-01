export const useHistory = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
}))
export const useLocation = vi.fn(() => ({
  search: '',
  push: vi.fn(),
}))
