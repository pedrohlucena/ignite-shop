import { AppProps } from 'next/app';
import { globalStyles } from '../styles/global';

globalStyles();

import Image from 'next/image';
import Link from 'next/link';
import logoImg from '../assets/logo.svg';
import { Container, Header } from '../styles/pages/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Link href="/">
          <Image src={logoImg} alt="" />
        </Link>
      </Header>

      <Component {...pageProps} />
    </Container>
  );
}
