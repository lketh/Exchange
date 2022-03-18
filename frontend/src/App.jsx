import Footer from "./components/Footer";
import Exchange from "./components/Exchange";
import Liquidity from "./components/Liquidity";
import Navbar from "./components/Navbar";
import { SteakProvider } from "./context/SteakContext";
import { ExchangeProvider } from "./context/ExchangeContext";
import { WalletProvider } from "./context/WalletContext";
import PoolInfo from "./components/PoolInfo";
import UI from "./components/UI";

function App() {
  return (
    <div className="bg-lime-400 ">
      <WalletProvider>
        <ExchangeProvider>
          <SteakProvider>
            <UI />
          </SteakProvider>
        </ExchangeProvider>
      </WalletProvider>

      {/* cf
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
      </WalletProvider> */}
    </div>
  );
}

export default App;
