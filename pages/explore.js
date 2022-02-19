import DefaultLayout from '../components/DefaultLayout';
import ExploreBuy from '../components/Explore/ExploreBuy';

export default function ExplorePage() {
  return (
    <>
      <ExploreBuy />
    </>
    );
}

ExplorePage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}
