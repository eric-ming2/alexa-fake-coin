import './App.css';
import { useState, useEffect } from 'react';


function App() {

  const [data, setData] = useState(null);
  const [updated, setUpdated] = useState(null)

  useEffect(() => {
    async function updateTable() {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch("https://b2862lapf2.execute-api.us-east-1.amazonaws.com/items", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result)
          setData(JSON.parse(result));
          if (updated == null) {
            setUpdated(JSON.parse(result));
          }
        })
        .catch(error => console.log('error', error));
    }
    if (data == null) {
      updateTable();
    }
  }, [data, updated]);


  const Table = () => {
    var display = <br />;
    if (data && data.Items) {
      display = data.Items.map(item => {
        return (
          <div>
            <label>
              ID: {item.id.substring(0, 30)}
              <input type="text" name={item.id} onChange={handleChange} id={item.id} />
            </label>
            <input type="submit" value="Submit" onClick={handleSubmit} id={"s" + item.id}/>
          </div>
        )
      });
    }
    return display
  }

  const handleChange = (e) => {
    let newUpdated = { ...updated };
    newUpdated[e.target.id] = e.target.value;
    setUpdated(newUpdated);
    // console.log(e);
    // console.log(e.target.id)
    // console.log(e.target.value)
  }

  const handleSubmit = (e) => {
    const id = e.target.id.substring(1);
    const output = updated[id];
    apiPut(id, output)
  }

  const apiPut = (id, output) => {
    console.log("apiPut:");
    console.log(id);
    console.log(output);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    var raw = JSON.stringify({
      "id": id,
      "output": output
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://b2862lapf2.execute-api.us-east-1.amazonaws.com/items", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  return (
    <div className="App">
      <h1>Eric's fake coin flip preferences</h1>
      {Table()}
    </div>
  );
}

export default App;
