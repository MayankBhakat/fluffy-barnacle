import Footer from "../components/Footer"
import Header from "../components/Header"
import SellCenter from "../components/SellCenter"
import  Search  from '../components/Search.js';

import './Sell.css'
function SellPage () {


    return (
        <div className="Rent">
            <Header ></Header>
            <SellCenter></SellCenter>
            <Search pokemon={"sell"}></Search>
            <Footer ></Footer>
        </div>
    )

} 

export default SellPage
