import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Stripe from 'stripe';
import { stripe } from '../../lib/stripe';
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '../../styles/pages/product';

interface Product {
  name: string;
  description: string;
  imageUrl: string;
  price: string;
}

interface ProductProps {
  product: Product;
}

export default function Product({ product }: ProductProps) {
  const { name, description, imageUrl, price } = product;

  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={imageUrl} width={520} height={480} alt="" />
      </ImageContainer>

      <ProductDetails>
        <h1>{name}</h1>
        <span>{price}</span>

        <p>{description}</p>

        <button>Comprar agora</button>
      </ProductDetails>
    </ProductContainer>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const retrieveParams = {
    expand: ['default_price'],
  };

  const stripeProduct = await stripe.products.retrieve(
    params.id,
    retrieveParams,
  );

  const { name, images, default_price, description } = stripeProduct;

  const formatOptions: [string, Intl.NumberFormatOptions] = [
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    },
  ];

  const price = default_price as Stripe.Price;

  const formatedPrice = new Intl.NumberFormat(...formatOptions).format(
    price.unit_amount / 100,
  );

  const product = {
    name,
    description,
    imageUrl: images[0],
    price: formatedPrice,
  };

  return {
    props: {
      product,
      revalidate: 60 * 60 * 1, // 1 hour
    },
  };
};
