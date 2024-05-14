import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { HomeContainer, Product } from '../styles/pages/home';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
}

type HomeProps = {
  products: Product[];
};

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map((product) => {
          const { id, name, imageUrl, price } = product;

          return (
            <Link key={id} href={`/product/${id}`} prefetch={false}>
              <Product className="keen-slider__slide">
                <Image src={imageUrl} width={520} height={480} alt="" />

                <footer>
                  <strong>{name}</strong>
                  <span>{price}</span>
                </footer>
              </Product>
            </Link>
          );
        })}
      </HomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({}) => {
  const listParams = {
    expand: ['data.default_price'],
  };

  const response = await stripe.products.list(listParams);
  const { data } = response;

  const products = data.map((product) => {
    const { id, name, images, default_price } = product;

    const price = default_price as Stripe.Price;

    const formatOptions: [string, Intl.NumberFormatOptions] = [
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL',
      },
    ];
    const formatedPrice = new Intl.NumberFormat(...formatOptions).format(
      price.unit_amount / 100,
    );

    return { id, name, imageUrl: images[0], price: formatedPrice };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
