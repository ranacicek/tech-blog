import { useEffect, useState } from 'react'
import ArticleList from './ArticleList'
import { store } from '../../app/stores/store';
import { ArticleSearchItem } from '../../app/models/ArticleSearchItem';
import { Pagination } from 'semantic-ui-react';

export default function LatestArticles() {  
  const [articles, setArticles] = useState<ArticleSearchItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {articleStore} = store;

  useEffect(()=> {

    const getLatestArticles = async ()=>{
      const pagedArticles = await articleStore.getLatestArticles(currentPage);

      console.log(pagedArticles);

      setCurrentPage(pagedArticles.pageNo);
      setTotalPages(pagedArticles.totalPages);

      setArticles(pagedArticles.items);
    }

    getLatestArticles();
   
  }, [currentPage]);

  const changeCurrentPage = (activePage: number) => {
    setCurrentPage(activePage);
  }

  return (
    <>
      <ArticleList articles={articles} editable={false}/>
      <Pagination 
      activePage={currentPage}
      totalPages={totalPages}
      onPageChange={(_, {activePage}) => changeCurrentPage(Number(activePage))}
      />
    </>
  )
}
