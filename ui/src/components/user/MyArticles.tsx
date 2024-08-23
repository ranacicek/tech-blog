import { useEffect, useState } from "react";
import { store } from "../../app/stores/store";
import { ArticleSearchItem } from "../../app/models/ArticleSearchItem";
import ArticleList from "../articles/ArticleList";
import { router } from "../../app/router/router";
import { Pagination } from "semantic-ui-react";

export default function MyArticles() {
  const [articles, setArticles] = useState<ArticleSearchItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {articleStore} = store;

  useEffect(()=> {

    const getMyArticles = async ()=>{
      const pagedArticles = await articleStore.getMyArticles(currentPage);      

      setCurrentPage(pagedArticles.pageNo);
      setTotalPages(pagedArticles.totalPages);

      setArticles(pagedArticles.items);
    }

    getMyArticles();
   
  }, [currentPage]);

  const changeCurrentPage = (activePage: number) => {
      setCurrentPage(activePage);
  }

  return (
    <>
      <button onClick={()=> router.navigate("/addarticle")}>Write New Article</button>
       <h2>My Articles</h2>
       <hr/>
      <ArticleList articles={articles} editable={true}/>
      <Pagination 
      activePage={currentPage}
      totalPages={totalPages}
      onPageChange={(e, {activePage}) => changeCurrentPage(Number( activePage))}
      />
    </>
  )
}
