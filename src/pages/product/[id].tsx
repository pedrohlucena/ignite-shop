import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '../../styles/pages/product';

export default function Product() {
  const { query } = useRouter();

  return (
    <ProductContainer>
      <ImageContainer>
        <Image
          src="https://files.stripe.com/links/MDB8YWNjdF8xUEZPMGVGQUk3aEQ1TUlafGZsX3Rlc3RfRkoxQ2t5THY0TzVFdGRiYmFpRW5zMGJJ00cBAwAJ15"
          width={520}
          height={480}
          alt=""
        />
      </ImageContainer>

      <ProductDetails>
        <h1>Camiseta X</h1>
        <span>R$ 79,90</span>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          fugiat, earum obcaecati dolores voluptates nobis harum quidem officia
          totam eveniet corrupti eius, esse molestiae repellat rem reprehenderit
          ea pariatur eligendi.
        </p>

        <button>Comprar agora</button>
      </ProductDetails>
    </ProductContainer>
  );
}
