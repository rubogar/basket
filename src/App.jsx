import Stats from "./pages/Stats";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Stats />
    </ThemeProvider>
  );
}

export default App;
