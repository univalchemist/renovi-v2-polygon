import { useRouter } from 'next/router';

import DefaultLayout from '../components/DefaultLayout';
import ExploreSearch from '../components/Explore/ExploreSearch';

export default function SearchResultsPage() {
  const router = useRouter();
  const { s } = router.query;

  return (
    <>
      <ExploreSearch searchkey={s} />
    </>
    );
}

SearchResultsPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}
