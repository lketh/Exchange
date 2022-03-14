import Footer from "./components/Footer";
import Exchange from "./components/Exchange";
import Liquidity from "./components/Liquidity";
import Navbar from "./components/Navbar";
import { SteakProvider } from "./context/SteakContext";
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
              <SteakProvider>
                <PoolInfo />
                <Exchange />
                <Liquidity />
              </SteakProvider>
            </ExchangeProvider>
          </div>
          <Footer />
        </div>
      </WalletProvider>
    </div>
  );
}

export default App;
