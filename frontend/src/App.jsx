import { Provider } from "react-redux";
import { store } from "./store";
import ArtistSearch from "./components/ArtistSearch";
import styles from "./App.module.css";

function App() {
  return (
    <Provider store={store}>
      <div className={styles.app}>
        <h1 className={styles.title}>Artist Search</h1>
        <ArtistSearch />
      </div>
    </Provider>
  );
}

export default App;
