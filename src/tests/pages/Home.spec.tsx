import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import { mocked } from 'ts-jest/utils'
import Home, { getStaticProps } from '../../pages'

jest.mock('next/router')
jest.mock('../../services/stripe')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
}})
describe('Home', () => {
  it('renders correctly', () => {
    render(
      <Home product={{priceId: 'id', amount: '2'}} />
    )
    expect(screen.getByText('for 2 month')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const retriveStripePricesMocked = mocked(stripe.prices.retrieve)
    retriveStripePricesMocked.mockResolvedValueOnce({
      id: 'id',
      unit_amount: 1000,
    } as any)
    const response = await getStaticProps({})
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})