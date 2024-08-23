import { Button, Form, FormField, } from 'semantic-ui-react';
import { store } from '../../app/stores/store';
import { useEffect, useState } from 'react';
import { Formik, Field } from 'formik';
import { useParams } from 'react-router-dom';
import { showConfirm, showError, showInfo } from '../utils/Toast';
import { router } from '../../app/router/router';


export default function AddEditArticle() {

 const {id} = useParams();

 const formId = id + "aaa";

const {articleStore} = store;
const [article, setArticle] = useState({
  id: '',
  title: "My Title",
  shortDescription: "Short description",
  content: "My content",
  isPublished: true
});

useEffect(()=> {

  const getArticle = async ()=> {
    const localArticle = await articleStore.getArticle(id!);

      setArticle(localArticle.article);
  }

  if(id) {
    getArticle();
  }
}, []); /////

  async function handleFormSubmit(values: {title: string, shortDescription: string, content: string, isPublished: boolean}) {
    
    if(id) {//Update
      try {
        const response = await articleStore.updateArticle(id, {...values});

        showInfo("Updated", response );
      }
      catch {
        showError("Error", "Failed to update article.");
      }
      
    } else {//Add

      try{
        const response = await articleStore.addArticle(values);

        await showInfo("Added", "New article added" );

        router.navigate("/editarticle/"+response.id);
      }
      catch {
        showError("Error", "Failed to add article.");
      }     
    }      
  }

  async function handleDeleteClick() {
    const confirmResult = await showConfirm("Delete?", "Do you want to delete artcile?");

    if(confirmResult.isConfirmed) {
      await articleStore.deleteArticle(id!);

      router.navigate("/myarticles");
    }

    console.log(confirmResult);
  }

  return (
    <div key={formId}>
        <Formik 
        initialValues={article}
        enableReinitialize={true} 
        onSubmit={handleFormSubmit}
        >
      {({ handleSubmit }) => ( // Formik'in handleSubmit fonksiyonunu kullandık
        <Form onSubmit={handleSubmit}>
          <FormField>
            <label  htmlFor="title">Title</label>
            <Field name="title" type="text" as={Form.Input} />        
          </FormField>
          <FormField>
            <label htmlFor="shortDescription">Short Description</label>
            <Field name="shortDescription" type="text" as={Form.TextArea} />
          </FormField>
          <FormField>
            <label htmlFor="content">Content</label>
            <Field name="content" type="text" as={Form.TextArea} />
          </FormField>
          <FormField>
          <label>
            <Field name="isPublished" type="checkbox"/>  Is Published  
          </label>
          </FormField>

        {article.id ? (<div style={{display:'block'}}><Button type='submit'>Update Article</Button> <Button type='button' color='red' onClick={handleDeleteClick} style={{float:'right'}}>Delete Article</Button></div>)
          :<Button type='submit'>Add Article</Button> 
        }
            
        </Form>
      )}
    </Formik>
    </div>
  )
}
