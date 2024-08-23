import React from 'react';
import { Outlet } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import TopBar from './TopBar';
import { Container } from 'semantic-ui-react';
import FooterBar from './FooterBar';
import ArticleList from '../articles/ArticleList';

function App() {
  return (
    <>
    <div className='app'>
      <header>
        <h1>Tech-Blog</h1> <h3>Articles For Owner</h3>
      </header>  
      <TopBar/>
      <Container>
          <Outlet/>
      </Container>        
    </div>
    <FooterBar/>
    </>    
  )
}

export default App;




































// import { useState } from 'react'
// import TopBar from './TopBar'
// import { Container } from 'semantic-ui-react'
// import { Outlet } from 'react-router-dom'
// import FooterBar from './FooterBar'

// export default function App() {

//   return (
//     <>
//     <TopBar/>
//     <Container>
//       <Outlet/>
//     </Container>
//     <FooterBar/>
//     </>
//   )
// }


