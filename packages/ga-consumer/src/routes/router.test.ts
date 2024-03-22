import { router } from './router'

describe('router', () => {
  const routes = [{ path: '/health', method: 'get' }]

  it.each(routes)('`$method` exists on $path', (route) => {
    expect(router.stack.some((s) => Object.keys(s.route.methods).includes(route.method))).toBe(true)
    expect(router.stack.some((s) => s.route.path === route.path)).toBe(true)
  })
})
