import Footer from "./components/Footer";
import Exchange from "./components/Exchange";
import Navbar from "./components/Navbar";
import { ExchangeProvider } from "./context/ExchangeContext";
import { WalletProvider } from "./context/WalletContext";
import PoolInfo from "./components/PoolInfo";

function App() {
  return (
    <div className="main">
      <WalletProvider>
        <div className="container">
          <Navbar />
          <div>
            <ExchangeProvider>
              <PoolInfo />
              <Exchange />
            </ExchangeProvider>
          </div>
          <Footer />
        </div>
      </WalletProvider>
    </div>
  );
}

export default App;
