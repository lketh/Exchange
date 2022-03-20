import {SteakProvider} from "./context/SteakContext";
import {ExchangeProvider} from "./context/ExchangeContext";
import {WalletProvider} from "./context/WalletContext";
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
    </div>
  );
}

export default App;
