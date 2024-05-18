import Footer from "../components/Footer"
import Header from "../components/Header"
import TransactionHistoryComponent from "../components/TransactionHistoryComponent"
import './TransactionHistoryPage.css'

function TransactionHistoryPage () {
    return (
        <div>
            <Header></Header>
           <TransactionHistoryComponent></TransactionHistoryComponent>
            <Footer ></Footer>
        </div>
    )

} 

export default TransactionHistoryPage