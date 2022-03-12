import Header from './components/Header';
import MyAccount from './components/MyAccount';
import Main from './components/Main';

function App() {
  return (
    <>
      <div className="bg-pink-500">test tailwind (not working)</div>
      <Header></Header>
      <MyAccount></MyAccount>
      <Main></Main>
      <pre id="log"></pre>
    </>
  );
}

export default App;
