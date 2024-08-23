import { Link } from 'react-router-dom'
import { Menu, MenuItem, MenuMenu, Search, Image, Dropdown, DropdownMenu, DropdownItem, DropdownDivider } from 'semantic-ui-react'
import { store } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';

function TopBar() {

  const { accountStore, articleStore } = store;

  let searchText='';
  let searchTimeoutHandler: number | undefined;

  const handleSearchTextChange = (currentValue: string)=> {

    clearTimeout(searchTimeoutHandler);
    searchTimeoutHandler = setTimeout(performSearch, 1300);

    searchText = currentValue;    
  }

  const performSearch = ()=> {

    articleStore.setSearchText(searchText);    
  }

  return (
    <Menu secondary>
      <MenuItem as={Link} name='Home' to='/'/>     

      {!accountStore.isLoggedin && (
        <>
        <MenuItem as={Link} name='Login' to='/login' />
        <MenuItem as={Link} name='Register' to='/register'/>  
        </>
      )}        
      
      <MenuItem>
        <Search 
          icon='search' 
          placeholder='Search...' 
          onSearchChange={(_, data)=> handleSearchTextChange(data.value!)}        
          open={false}
        />
      </MenuItem>
      <MenuMenu position='right'>
        {accountStore.isLoggedin && 
        <MenuItem>
          <Image src={'/image/user.png'} avatar spaced='right'/>
          <Dropdown>
            <DropdownMenu>
              <DropdownItem text='My Profile' icon='user' as={Link} to="/myprofile"/>
              <DropdownItem text='My Articles' icon='file alternate outline' as={Link} to="/myarticles"/>
              <DropdownItem text='Add Article' icon='edit outline' as={Link} to="/addarticle"/>
              <DropdownDivider/>
              <DropdownItem text='Logout' icon='power' onClick={()=> accountStore.logout()}/>
            </DropdownMenu>
          </Dropdown>
        </MenuItem>
      }
      </MenuMenu>
     </Menu>
  )
}

export default observer(TopBar);
