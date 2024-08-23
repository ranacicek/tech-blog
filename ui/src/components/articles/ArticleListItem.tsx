import React from 'react'
import { ArticleSearchItem } from '../../app/models/ArticleSearchItem';



interface Props {
  article: ArticleSearchItem;
}

export default function ArticleListItem({article} : Props) {
  
  return (
    <div style={{ flexDirection:'row'}}>
      <div className='articlelistitem-titles'>
      <h2><a href={"/viewarticle/"+article.id}>{article.title}</a></h2>
      <label>{article.firstName+" "+article.surname}</label>  
      </div>
      <p className='articlelistitem-short-desc'>{article.shortDescription}</p>  
       
      <hr />
    </div>
  )
}
