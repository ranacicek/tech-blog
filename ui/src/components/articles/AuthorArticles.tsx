import { useState, useEffect } from 'react';
import { ArticleSearchItem } from '../../app/models/ArticleSearchItem';
import { store } from '../../app/stores/store';
import { useParams } from 'react-router-dom';
import ArticleList from './ArticleList';
import { Pagination } from 'semantic-ui-react';


export default function AuthorArticles() {

  const {id} = useParams();

  const [author, setAuthor] = useState({id: '', firstName:'', surname:''});
  const [articles, setArticles] = useState<ArticleSearchItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {articleStore} = store;

  useEffect(()=> {

    const getMyArticles = async ()=>{
      const authorArticles = await articleStore.getAuthorArticles(id!, currentPage);      

      setCurrentPage(authorArticles.articles.pageNo);
      setTotalPages(authorArticles.articles.totalPages);

      setAuthor({
          id:authorArticles.user.id,
          firstName: authorArticles.user.firstName,
          surname: authorArticles.user.surname
      });
      setArticles(authorArticles.articles.items);
    }

    getMyArticles();
   
  }, [currentPage]);

  const changeCurrentPage = (activePage: number) => {
      setCurrentPage(activePage);
  }
  return (
    <>    
       <h2> <a href={"/authorprofile/"+author.id}>{author.firstName+" "+author.surname}</a>'s Articles</h2>
       <hr/>
      <ArticleList articles={articles} editable={false}/>
      <Pagination 
      activePage={currentPage}
      totalPages={totalPages}
      onPageChange={(_, {activePage}) => changeCurrentPage(Number(activePage))}
      />
    </>
  );
}
