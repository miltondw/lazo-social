import "../styles/globals.css";
import Layaut from "../components/Layaut/Layaut";
import { DataProvider } from "../store/GlobalState";

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Layaut>
        <Component {...pageProps} />
      </Layaut>
    </DataProvider>
  );
}

export default MyApp;
