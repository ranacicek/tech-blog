import React, { useEffect, useState } from 'react'
import { store } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ArticleList from './ArticleList';
import { Pagination } from 'semantic-ui-react';
import { ArticleSearchItem } from '../../app/models/ArticleSearchItem';
import { reaction } from 'mobx';

interface PagingState {
    currentPage: number;
    totalPages: number;
    articles: ArticleSearchItem[];
}

function SearchArticles() {

    const [pagingState, setPagingState] = useState<PagingState>({
        currentPage: 0,
        totalPages: 0,
        articles: []
    });

  const {articleStore} = store;

  reaction(()=> articleStore.searchText, ()=> {  
    searchArticles(true, pagingState);
  });

  const searchArticles = async (isNewSearch: boolean, newState:PagingState)=>{

    //console.log(pagingState);

    if(articleStore.searchText) {
        const searchResults = await articleStore.searchArticles(articleStore.searchText, isNewSearch ? 1: newState.currentPage);     

        setPagingState({
            currentPage: searchResults.pageNo,
            totalPages: searchResults.totalPages,
            articles: searchResults.items
        });       
    }
    else {
        setPagingState({
            currentPage: 0,
            totalPages: 0,
            articles: []
        });      
    }
  }

  useEffect(()=> {    

    searchArticles(false, pagingState);     
  }, []);

  const changeCurrentPage = (activePage: number) => {

    //console.log("activepage:"+activePage);

    const newState = {...pagingState, currentPage:activePage};

    //console.log("new state:", newState);

    setPagingState(newState);
    searchArticles(false, newState);
  }

  return (
    <>
        <ArticleList articles={pagingState.articles} editable={false}/>
        <Pagination 
            activePage={pagingState.currentPage}
            totalPages={pagingState.totalPages}
            onPageChange={(e, {activePage}) => changeCurrentPage(Number(activePage))}
        />
     </>
  )
}

export default observer(SearchArticles);
