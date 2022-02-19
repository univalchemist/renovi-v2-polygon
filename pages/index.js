import DefaultLayout from '../components/DefaultLayout';
import Hero from '../components/Hero/Hero';
import Auctions from '../components/Auctions/Auctions';
import TopSeller from '../components/TopSeller/TopSeller';
import Explore from '../components/Explore/Explore';

export default function Index() {
  return (
    <>
      <TopSeller />
      {/*<Auctions />*/}
      <Explore />
    </>
    );
}

Index.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}
