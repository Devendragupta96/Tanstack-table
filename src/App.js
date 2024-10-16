import './App.css';
import TableView from './component/TableView';
import KeyboardArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardArrowLeftTwoTone";

function App() {

  return (
    <div className="App">
      <header className="header">
        <KeyboardArrowLeftTwoToneIcon />
        <p>Table View</p>
      </header>
      {/* <h2>Table</h2> */}
      <TableView/>
    </div>
  );
}

export default App;
