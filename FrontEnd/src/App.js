import React from 'react';
import Table from './Table';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { searchString : '', countryCode : 'au' , tableData : {} };
    this.onInputChange = this.onInputChange.bind(this);
    this.search = this.search.bind(this);
  }

  search() {
      if (this.state.searchString !== '') {
        let opts = {
          "indexName" : "social_profile_idx",
          "countryCode" : this.state.countryCode,
          "searchStr" : this.state.searchString,
          "groupBy" : "social_name.keyword",
          "groupSize" : 5
          };
        fetch('http://192.168.1.197:3030/elastic-search/search-data', {
        method: 'post',
        body: JSON.stringify(opts)
        })
        .then(res => res.json())
        .then((searchResponse) => {
          if (searchResponse && 0 === searchResponse.total) {
            this.setState({showTable : false}); 
          } else {
            this.setState({showTable : true}); 
            this.setState({tableData: searchResponse.data });
          }
        })
        .catch(console.log)
      } else {
       alert("Please Enter a text to search");
      }
  }

  onInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  render () {
    let data = this.state.tableData;
    let tables = [];
    Object.keys(data).forEach(function(key, index) { tables[index] = <Table tableName={key} records={data[key]} /> })
    return (
      <div>
        <div className="header">
          <h2 className='title'>Elastic Search</h2>
          <div className="search">
            <span>
              <select value={this.state.countryCode} onChange={this.onInputChange} name="countryCode" className="h-25">
                <option value="au">Australia</option>
                <option value="de">Denmark</option>
                <option value="in">India</option>
                <option value="nz">New Zealand</option>
                <option value="us">United States of America</option>
              </select>
            </span>
            <span className="searchBar">
              <input value={this.state.searchString} onChange={this.onInputChange} name="searchString" type="text" placeholder="Search.." className="h-25 searchBox" />
            </span>
            <span>
              <button className="h-25" onClick={this.search}>Search</button>
            </span>
          </div>
        </div>
        <div className="content">
          {this.state.showTable && tables.map(table => table)}
          {this.state.showTable === false && <div className="error"> No Record Found </div>}
        </div>
      </div>
    );  
  } 
}

export default App;
