import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client'
import { SignInButton } from '.'

jest.mock('next-auth/client')

describe('SignInButton', () => {
  it('renders correctly when user is not logged', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])
    render(
      <SignInButton />
    )
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
  })
  it('renders correctly when user is logged', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([{
      expires: 'test',
      user: {
        email: 'g@g.com',
        image: 'image',
        name: 'Gabriel'
      }
    }, false])
    render(
      <SignInButton />
    )
    expect(screen.getByText('Gabriel')).toBeInTheDocument()
  })
})