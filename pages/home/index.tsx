import gsap from 'gsap';
import { mapRange } from 'gsap/all';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import ButtonText from '../../components/ButtonText';
import CommonButton from '../../components/CommonButton';
import Layout from '../../components/Layout';
import Product from '../../components/Product';
import { Section } from '../../components/styledComponents';
import { TransitionScreen } from '../../components/TransitionScreen';
import { setScrollSmooth } from '../../hooks/ScrollSmooth';
import { HomeContent } from '../../types/home_api_responses';
import { Product as Product_T } from '../../types/products_api_response';
import { Room as Room_T } from '../../types/rooms_api_response';
import { Store as Store_T } from '../../types/stores_api_response';
import { HEADERS } from '../../utils/globals';
import Images from './components/Images';
import Room from './components/Room';
import Store from './components/Store';

interface Props {
   content: HomeContent;
   products: Product_T[];
   rooms: Room_T[];
   stores: Store_T[];
}

export interface BgProps {
   bgHref: string;
}

const Hero = styled.section<BgProps>`
   ${tw`
      bg-cover bg-center
      flex flex-col items-center justify-center gap-8
      px-5 py-36
      text-titles
   `}

   ${tw`
      lg:( 
         bg-center
         h-screen
      )
   `}

   h1 {
      ${tw`
         text-center text-titles text-6xl
      `}

      ${tw`
         md:( 
            text-8xl
            w-4/5
         )
      `}

      ${tw`
         lg:(
            text-9xl
         )
      `}

      ${tw`
         xl:(
            max-w-screen-xl
            w-2/3
         )
      `}
   }

   ${({ bgHref }) => {
      return `background-image: url(${bgHref})`;
   }}
`;

const Container = styled.div`
   h2 {
      ${tw`
         text-5xl
      `}

      ${tw`
         lg:( text-7xl )
      `}
   }

   .rooms {
      .roomsContainer {
         ${tw`
            grid grid-cols-1 gap-8 
            mx-auto max-w-[200px]
         `}

         ${tw`
            xs:(
               grid-cols-2
               max-w-full
            )
         `}

         ${tw`
            md:(
               grid-cols-3
            )
         `}
      }
   }
`;

const Home = ({ content, products, rooms, stores }: Props) => {
   useEffect(() => {
      setScrollSmooth('#homeWrapper', '', 'x');

      gsap.registerPlugin(ScrollTrigger);

      const titleAppear = gsap.from('#homeWrapper h1', {
         delay: 0.8,
         duration: 0.4,
         opacity: 0,
         yPercent: 10,
         scrollTrigger: {
            trigger: '#homeWrapper h1',
            scroller: '#homeWrapper',
         },
      });

      let bubblesMovement: any;

      const setAnimation = () => {
         bubblesMovement = gsap.fromTo(
            '.bubble',
            {
               x: () => `${Math.random() * 70}vw`,
               y: '100vh',
            },
            {
               ease: 'none',
               scale: () => mapRange(0, 1, 0.2, 0.5, Math.random()),
               stagger: 0.08,
               y: '-100%',
               scrollTrigger: {
                  trigger: '#imagesWrapper',
                  scroller: '#homeWrapper',
                  scrub: true,
                  pin: true,
                  start: 'top top',
                  end: `${content.bubble.data.length * 300}vh end`,
               },
            }
         );
      };

      setAnimation();

      window.onresize = () => {
         bubblesMovement.revert();
         setAnimation();
      };

      return () => {
         window.onresize = null;

         titleAppear.revert();
         bubblesMovement.revert();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const PageHead = () => (
      <Head>
         <base href="/" />
         <title>Home</title>
         <meta
            name="description"
            content="SØLVE is a furniture store with quite style."
            key="desc"
         />
         <meta property="og:title" content="SØLVE Furniture" />
         <meta property="og:description" content="SØLVE is a furniture store with quite style." />
         <meta property="og:image" content="/thumbnail.webp" />
      </Head>
   );

   return (
      <>
         <PageHead />
         <TransitionScreen>
            <div id="homeWrapper" tw="h-screen">
               <Container>
                  <Layout inHome>
                     <Hero bgHref={content.background.data.attributes.url}>
                        <h1>{content.title}</h1>
                        <Link href="/shop">
                           <a>
                              <CommonButton type="inverse">SHOP NOW</CommonButton>
                           </a>
                        </Link>
                     </Hero>
                     <Section className="featured" tw="border-b border-texts border-opacity-20">
                        <h2 tw="mb-12 text-center">Featured</h2>
                        <div tw="grid grid-cols-2 gap-8 md:( grid-cols-3 )">
                           {products.map(
                              product =>
                                 product.attributes.featured && (
                                    <Product key={product.id} product={product} />
                                 )
                           )}
                        </div>
                     </Section>
                     <Section className="highlight" tw="lg:( grid grid-cols-2 )">
                        <h3 tw="mb-10 text-5xl lg:( text-7xl mr-20 )">Lorem ipsum</h3>
                        <div>
                           <div>
                              {content.highlight.text.split('_').map((p, i) => {
                                 return (
                                    <p tw="mb-10" key={i}>
                                       {p}
                                    </p>
                                 );
                              })}
                              <Link href="/shop">
                                 <a>
                                    <CommonButton type="default">SHOP NOW</CommonButton>
                                 </a>
                              </Link>
                           </div>
                        </div>
                     </Section>
                     <Images
                        bgHref={content.bubblesBackground.data.attributes.url}
                        bubbles={content.bubble.data}>
                        {content.bubblesTitle}
                     </Images>
                     <Section className="rooms">
                        <h2 tw="text-center">Rooms</h2>
                        <Link href="rooms">
                           <div tw="flex justify-center my-6">
                              <ButtonText arrowPos="after">SEE ALL</ButtonText>
                           </div>
                        </Link>
                        <div className="roomsContainer">
                           {rooms.map((room, i) => {
                              return i < 3 ? <Room key={room.id} room={room} /> : null;
                           })}
                        </div>
                     </Section>
                     <Section
                        className="stores"
                        tw="border-texts border-opacity-20 border-t border-b">
                        <h2>Our Stores</h2>
                        <div tw=" lg:( grid grid-cols-2 ) ">
                           {stores.map(store => {
                              return <Store key={store.id} store={store} />;
                           })}
                        </div>
                     </Section>
                  </Layout>
               </Container>
            </div>
         </TransitionScreen>
      </>
   );
};

export const getStaticProps: GetStaticProps = async ctx => {
   const homeRes = await fetch(process.env.NEXT_PUBLIC_API + '/api/home?populate=*', HEADERS);
   const homeData = await homeRes.json();

   const productsRes = await fetch(
      process.env.NEXT_PUBLIC_API + '/api/products?populate=*',
      HEADERS
   );
   const productsData = await productsRes.json();

   const roomsRes = await fetch(process.env.NEXT_PUBLIC_API + '/api/rooms?populate=*', HEADERS);
   const roomsData = await roomsRes.json();

   const storesRes = await fetch(process.env.NEXT_PUBLIC_API + '/api/stores?populate=*', HEADERS);
   const storesData = await storesRes.json();

   return {
      props: {
         content: homeData.data.attributes,
         products: productsData.data,
         rooms: roomsData.data,
         stores: storesData.data,
      },
   };
};

export default Home;
