import React from 'react';
import Table from './Table';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      refreshTable: false,
      // totalResults [],
      searchString : '', countryCode : 'au' , tableData : {} };
    this.onInputChange = this.onInputChange.bind(this);
  }

  search = () => {
      if (this.state.searchString !== '') {
        this.setState({
          tableData: {}
        });
        let opts = {
          "indexName" : "prod_social_idx",
          "countryCode" : this.state.countryCode,
          "searchStr" : this.state.searchString,
          "groupBy" : "social_name.keyword",
          "groupSize" : 5
          };
        fetch('http://172.31.98.145:3030/elastic-search/search-data', {
        method: 'post',
        body: JSON.stringify(opts)
        })
        .then(res => res.json())
        .then((searchResponse) => {
          debugger;
          if (searchResponse && 0 < searchResponse.total) {
            this.setState({totalResults : searchResponse.total});
            this.setState((state, props) => ({
              tableData: {
                ...searchResponse.data
              },
              refreshTable: !state.refreshTable,
              showTable: true
            }));
          } else {
            this.setState({showTable : false}); 
          }
          this.forceUpdate();
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
    const { tableData, refreshTable, showTable, totalResults } = this.state;
    console.log('render', this.state);
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
          {
            showTable && <h3 className="type"> Total Results : {totalResults} </h3>
          }
          {
            showTable &&
            Object.keys(tableData).map((item, index) => (
              <Table key={index} refreshTable={refreshTable} tableName={item} records={tableData[item]}/>
            ))
          }
          {this.state.showTable === false && <div className="error"> No Record Found </div>}
        </div>
      </div>
    );  
  } 
}

export default App;
