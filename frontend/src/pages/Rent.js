import Footer from "../components/Footer"
import Header from "../components/Header"
import RentCenter from "../components/RentCenter"
import  Search  from '../components/Search.js';

import './Rent.css'
function RentPage () {


    return (
        <div className="Rent">
            <Header ></Header>
            <RentCenter></RentCenter>
            <Search></Search>
            <Footer ></Footer>
        </div>
    )

} 

export default RentPage
