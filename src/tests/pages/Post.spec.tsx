import { render, screen } from '@testing-library/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { mocked } from 'jest-mock'
import { getSession } from 'next-auth/react'

import { getPrismicClient } from '../../services/prismic'

const post = { slug: 'my-new-post', title: 'My New Post', content: '<p>Post excerpt</p>', updatedAt: '10 de abril' }

jest.mock('next-auth/react')
jest.mock('../../services/prismic')


describe('Post page', () => {
    it('renders corretly', () => {

        render(<Post post={post} />)

        expect(screen.getByText('My New Post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    });

    it('redirects user if no subscription is found', async () => {
        const getsessionMocked = mocked(getSession)

        getsessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/'
                })
            })
        )
    })

    it('loads initial data', async () => {
        const getsessionMocked = mocked(getSession)
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'My new post', spans: [] }
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post content', spans: [] }
                    ],
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        getsessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)

        const response = await getServerSideProps({
            params: { slug: 'my-new-post' }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My new post',
                        content: '<p>Post content</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )

    })

})