import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState<string>("Loading...");

  useEffect(() => {
    axios
      .get("http://localhost:8080/docs")
      .then((response) => setText(response.data))
      .catch(() => setText("Failed to load documentation."));
  }, []);

  return (
    <div className="text-center text-xl font-bold p-4">
      {text}
    </div>
  );
}

export default App;
