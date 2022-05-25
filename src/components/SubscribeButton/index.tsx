import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data: session } = useSession();
    const router = useRouter()

    async function handleSubscribe() {
        if (!session) {
            signIn('github')
            return;
        }

        if (session?.activeSubscription) {
            router.push('/posts')
            return;
        }

        // criar o checkout session
        try {
            const response = await api.post('/subscribe')

            const { sessionID } = response.data

            const stripe = await getStripeJs()

            console.log(response.data)

            await stripe.redirectToCheckout({ sessionId: sessionID })


        } catch (error) {
            alert(error)
        }

    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe Now
        </button>
    )
}