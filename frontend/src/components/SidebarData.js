import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import HouseIcon from '@mui/icons-material/House';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import ListIcon from '@mui/icons-material/List';
import RoofingIcon from '@mui/icons-material/Roofing';
import PaidIcon from '@mui/icons-material/Paid';
export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Sell',
    path: '/sell',
    icon: <HouseIcon/>,
    cName: 'nav-text'
  },
  {
    title: 'Rent',
    path: '/rent',
    icon: <MapsHomeWorkIcon/>,
    cName: 'nav-text'
  },
  {
    title: 'Wishlist',
    path: '/wishlist',
    icon: <ListIcon />,
    cName: 'nav-text'
  },
  {
    title: 'MyOrders',
    path: '/orders',
    icon: <RoofingIcon />,
    cName: 'nav-text'
  },
  {
    title: 'Transactions',
    path: '/my_transaction',
    icon: <PaidIcon />,
    cName: 'nav-text'
  }
];
