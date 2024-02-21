import MainContent from "./components/MainContent"
import { Container } from "@mui/material";
import './App.css';


function App() {
  return (
    <>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100vw",
      }}
    >
      <Container>
        
        <MainContent />
      </Container>
    </div>
  </>
  );
}

export default App;
