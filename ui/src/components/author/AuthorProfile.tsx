import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { store } from "../../app/stores/store";

export default function AuthorProfile() {

  const {id} = useParams();
  const {accountStore} = store;
  
  const [authorInfo, setAuthorInfo] = useState({
    firstName: '',
    surname: '',    
    about: ''
  });

  useEffect(()=> {

    //const userProfile = 
    const getAuthorProfile = async ()=> {
      const authorProfile = await accountStore.getAuthorProfile(id!); 

      setAuthorInfo({
        firstName: authorProfile.firstName,
        surname: authorProfile.surname,    
        about: authorProfile.about
      });
    }

    getAuthorProfile();

  }, []);

  return (
    <div>
     
      <h3>{authorInfo.firstName+" "+authorInfo.surname}</h3>
      <hr/>
      <p>{authorInfo.about}</p>
      <hr/>
      <a href={"/authorarticles/"+id}>Authors's articles</a>      
    </div>
  )
}
