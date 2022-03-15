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
    <div className="grid grid-cols-6">
      <div className="col-start-2 col-span-4">
        <WalletProvider>
          <Navbar />
          <div>
            <ExchangeProvider>
              <SteakProvider>
                <PoolInfo />
                <div className="flex justify-evenly">
                  <div className="">
                    <Exchange />
                  </div>
                  <div className="">
                    <Liquidity />
                  </div>
                </div>
              </SteakProvider>
            </ExchangeProvider>
          </div>
          <Footer />
        </WalletProvider>
      </div>
    </div>
  );
}

export default App;
