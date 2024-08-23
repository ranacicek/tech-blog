import React from 'react'
import { ArticleSearchItem } from '../../app/models/ArticleSearchItem';
import ArticleListItem from './ArticleListItem';
import EditableArticleListItem from './EditableArticleListItem';

interface Props {
  articles: ArticleSearchItem[];
  editable: boolean;
}

export default function ArticleList({articles, editable}: Props) {

  return (
    <div>
       {articles.map(article =>   editable ? <EditableArticleListItem key={article.id} article={article}/> :  <ArticleListItem key={article.id} article={article} /> 
      )}
    </div>
  )
}
