import { Link } from "react-router-dom";

function App() {
  return (
    <div>
      <h1>Demos:</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
      >
        <Link to="/textarea/1">shared-textarea</Link> |{" "}
        <Link to="/terminal/1">terminal</Link>
      </nav>
    </div>
  );
}

export default App;
