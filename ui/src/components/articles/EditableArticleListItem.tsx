import React from 'react'
import { ArticleSearchItem } from '../../app/models/ArticleSearchItem';


interface Props {
  article: ArticleSearchItem;
}


export default function EditableArticleListItem({article} : Props) {
    return (
      <>
        <div style={{display:"flex", flexDirection:'row'}}>
          <a href={'/editarticle/'+article.id}>{article.title}</a>           
        </div>
        <hr/>
        </>
      )
}
