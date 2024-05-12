import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { HomeContainer, Product } from '../styles/pages/home';

type Product = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
};

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
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => {
        const { id, name, imageUrl, price } = product;

        return (
          <Product key={id} className="keen-slider__slide">
            <Image src={imageUrl} width={520} height={480} alt="" />

            <footer>
              <strong>{name}</strong>
              <span>R$ {price} </span>
            </footer>
          </Product>
        );
      })}
    </HomeContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const params = {
    expand: ['data.default_price'],
  };

  const response = await stripe.products.list(params);
  const { data } = response;

  const products = data.map((product) => {
    const { id, name, images, default_price } = product;

    const price = default_price as Stripe.Price;

    return { id, name, imageUrl: images[0], price: price.unit_amount / 100 };
  });

  return {
    props: {
      products,
    },
  };
};
