import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { SignInButton } from '.'
import { useSession } from 'next-auth/react'

jest.mock('next-auth/react')

describe('SignInButton component', () => {
    it('renders correctly when user is not authenticated', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

        render(
            <SignInButton />
        )

        expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
    })

    it('renders correctly when user is authenticated', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({ data: { user: { name: 'John Doe', email: 'john.doe@exemple.com' }, expires: 'fake-expires' }, status: 'authenticated' })

        render(
            <SignInButton />
        )

        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
})

