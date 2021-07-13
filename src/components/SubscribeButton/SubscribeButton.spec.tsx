import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/client'
import { SubscribeButton } from '.'

jest.mock('next-auth/client')
jest.mock('next/router')

describe('SubscribeButton', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])
    render(
      <SubscribeButton />
    )
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })
  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])
    render(<SubscribeButton />)
    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)
    expect(signInMocked).toHaveBeenCalled()
  })
  it('redirects to posts when user has a subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMocked = jest.fn()
    useSessionMocked.mockReturnValueOnce([{
      expires: 'test',
      user: {
        email: 'g@g.com',
        image: 'image',
        name: 'Gabriel'
      },
      activeSubscription: true,
    }, false])
    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    }as any)
    render(<SubscribeButton />)
    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)
    expect(pushMocked).toHaveBeenCalledWith('/posts')
  })
})