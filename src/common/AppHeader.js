import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import { useEffect, useState } from 'react'  
import './AppHeader.css';
import { Layout, Menu, Dropdown, Button, Drawer } from 'antd';
import { HomeOutlined, AppstoreAddOutlined, CaretDownOutlined } from '@ant-design/icons';
    
function AppHeader (props) {

  const [isVisible, setIsVisible] = useState(false);
 
    let menuItems;
   
    useEffect(() => {              
      setMenu();    
   }, [props.currentUser]);  

   const handleMenuClick = e => {
    if(e.key === "logout") 
      props.onLogout();
    
    if(e.key === "profile")
    props.history.push(`/users/${props.currentUser.username}`);

    if(e.key === "admin")
    props.history.push(`/admin`);

  }

    const setMenu=() => {         
        if(props.currentUser) {
          menuItems = [
            <Menu.Item key="/">
              <Link to="/">
                <HomeOutlined className="nav-icon" />
              </Link>
            </Menu.Item>,            
            <Menu.SubMenu key="/profile" onClick={handleMenuClick} title={<a className="ant-dropdown-link">
            <img className="user-avatar-nav" src={props.currentUser.avatar} /> <CaretDownOutlined/>
            </a>} className="profile-menu">
                 <Menu.Item key="user-info" className="dropdown-item" disabled>
                  <div className="user-full-name-info">
                  {props.currentUser.username}
                  </div>
                  <div className="username-info">
                  {props.currentUser.gogName}
                  </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="profile" className="dropdown-item">
            Profile       
            </Menu.Item>
            {props.currentUser.authorities.some(a=> a.authority==="ROLE_ADMIN")?
            <Menu.Item key="admin" className="dropdown-item"> Admin panel</Menu.Item>:null}
            <Menu.Item key="logout"  className="dropdown-item">
            Logout
            </Menu.Item>
            </Menu.SubMenu>
          ];
          if(props.currentUser.authorities.some(a=> a.authority==="ROLE_AUTHOR")){
          let newTask=[<Menu.Item key="/task/new">
          <Link to="/task/new">
            <AppstoreAddOutlined className="task-icon" />
          </Link>
        </Menu.Item>,]
        menuItems.splice(1, 0, newTask);
        }
        } else {
          menuItems = [
            <Menu.Item key="/login">
              <Link to="/login">Login</Link>
            </Menu.Item>,
            <Menu.Item key="/signup">
              <Link to="/signup">Signup</Link>
            </Menu.Item>                  
          ];
        }     
      };  


        return (
            <Layout.Header className="app-header">
            <div className="header">
              <div className="app-title" >
                <Link to="/">Gwentopedia</Link>
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[props.location.pathname]}
                style={{ lineHeight: '3.233vw' }} >
                  {setMenu()}                 
                  {menuItems}
              </Menu>
              <Button className="barsMenu" type="primary" onClick={()=>setIsVisible(!isVisible)}>
						<span className="barsBtn"></span>
					</Button>
					<Drawer
						title="Basic Drawer"
						placement="right"
						closable={false}
						onClose={()=>setIsVisible(!isVisible)}
						visible={isVisible}
					>
                <Menu mode="inline">
            {menuItems}</Menu>
					</Drawer>
            </div>
          </Layout.Header>
        );
    }


export default withRouter(AppHeader);