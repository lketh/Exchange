import Header from './components/Header';
import MyAccount from './components/MyAccount';
import Main from './components/Main';
// import Footer from './components/Footer';
// import Exchange from './components/Exchange';
// import Navbar from './components/Navbar';
// import { ExchangeProvider } from './context/ExchangeContext';
// import { WalletProvider } from './context/WalletContext';

function App() {
  return (
    // <div className="main">
    //   <WalletProvider>
    //     <div className="container">
    //       <Navbar />
    //       <div>
    //         <ExchangeProvider>
    //           <Exchange />
    //         </ExchangeProvider>
    //       </div>
    //       <Footer />
    //     </div>
    //   </WalletProvider>
    // </div>
    <>
      <Header></Header>
      <MyAccount></MyAccount>
      <Main></Main>
    </>
  );
}

export default App;
