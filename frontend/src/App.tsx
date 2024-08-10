import React, { useEffect } from "react";
import "./App.css";

const App: React.FC = () => {
  const [elements, setElements] = React.useState([]);
  const url = "http://localhost:8000/api/elements";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.elements);
        setElements(data.elements);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      {elements.map((element: any) => (
        <div className="element" key={element.id}>
          <p>id: {element.id}</p>
          <p>event: {element.event}</p>
          <p>element_group: {element.element_group}</p>
          <p>name: {element.name}</p>
          <p>alias: {element.alias}</p>
          <p>difficulty: {element.difficulty}</p>
          <p>row_number: {element.row_number}</p>
          
        </div>
      ))}
    </div>
  );
};

export default App;
