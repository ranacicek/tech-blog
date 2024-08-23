import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { store } from "../../app/stores/store";

export default function ViewArticle() {

  const {id} = useParams();

  const {articleStore} = store;

  const [articleInfo, setArticleInfo] = useState({    
    authorId: '',
    authorName: '',
    authorSurname: '',
    articleDate: '',
    title: "",
    content: "" 
  });

  useEffect(()=> {

    const getArticle = async ()=> {
      const localArticle = await articleStore.getArticle(id!);
  
      setArticleInfo({
          authorId: localArticle.user.id,
          authorName: localArticle.user.firstName,
          authorSurname: localArticle.user.surname,
          articleDate: localArticle.article.created.substring(0,10),
          title: localArticle.article.title,          
          content: localArticle.article.content 
        });
    }
  
    if(id) {
      getArticle();
    }
  }, []);

  return (
    <div>
      <div>
        <a href={"/authorprofile/"+articleInfo.authorId}>{articleInfo.authorName+" "+articleInfo.authorSurname}</a>
        <label style={{marginLeft:"50px"}}>{articleInfo.articleDate}</label>
      </div>
      <h3>{articleInfo.title}</h3>
      <hr/>
      <p> {articleInfo.content} </p>
      <hr/>
      <a href={"/authorarticles/"+articleInfo.authorId}>Authors's other articles</a>      
    </div>
  )
}
