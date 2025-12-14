import { useState } from "react";
import { AppRoutes } from "./router/AppRoutes";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
     <AppRoutes />
    </>
  );
}

export default App;
