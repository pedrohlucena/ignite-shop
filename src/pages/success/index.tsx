import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Stripe from 'stripe';
import { stripe } from '../../lib/stripe';
import { ImageContainer, SuccessContainer } from '../../styles/pages/success';

type Product = {
  name: string;
  imageUrl: string;
};

type SuccessProps = {
  customerName: string;
  product: Product;
};

export default function Success({ customerName, product }: SuccessProps) {
  return (
    <SuccessContainer>
      <h1>Compra efetuada!</h1>

      <ImageContainer>
        <Image src={product.imageUrl} width={120} height={110} alt="" />
      </ImageContainer>

      <p>
        Uhuul <strong>{customerName}</strong>, sua {''}
        <strong>{product.name}</strong> {''}
        já está a caminho da sua casa.
      </p>

      <Link href="/">Voltar ao catálogo</Link>
    </SuccessContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  const sessionId = String(query.session_id);

  const retrieveParams = {
    expand: ['line_items', 'line_items.data.price.product'],
  };

  const session = await stripe.checkout.sessions.retrieve(
    sessionId,
    retrieveParams,
  );

  const customerName = session.customer_details.name;
  const product = session.line_items.data[0].price.product as Stripe.Product;

  const { name, images } = product;

  return {
    props: {
      customerName,
      product: {
        name,
        imageUrl: images[0],
      },
    },
  };
};
