import { GetStaticProps } from "next";
import Head from "next/head"
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

/*

Temos 3 formas de fazer uma chamada a API dentro do NEXT
1 - Client-side (forma comum que já fazia no ReactJS)
2 - Server-side (fazendo requisição pelo servidor) - GetServerSideProps
3 - Static site Generation (gerando um HTML statico - OBS: nesse caso SÓ USAR EM PAGINA ESTATICA) - GetStaticProps

*/

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContiner}>
        <section className={styles.hero}>
          <span>👏  Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Ger access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>

    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1L0A9kEWZ8gBBUJV4TyDMEov')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24h
  }
}
