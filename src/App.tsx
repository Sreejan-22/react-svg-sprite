import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Icon } from "./Icon";

function App() {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>SVG sprite icons in React</h1>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more{" "}
        <Icon name="check" width="24px" height="24px" />
      </p>
    </>
  );
}

export default App;
