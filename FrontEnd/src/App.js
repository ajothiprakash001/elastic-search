import React from 'react';
import Table from './Table';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { searchString : '' , countryCode : 'AUS', 
    showTable : false,
     tables : [] };
    this.onInputChange = this.onInputChange.bind(this);
    this.search = this.search.bind(this);
  }

  search() {
     if (this.state.searchString !== '') {
      this.setState({tables: [{ "typeName": "Github", "records": [ { "country_code": "DE", "social_name": "github", "username": "karussell", "name": "Peter", "tags": "java, objective-c, css, ruby, c#, python", "url": "https://github.com/karussell", "country": "Germany", "links": "https://karussell.wordpress.com/about" }, { "country_code": "DE", "social_name": "github", "username": "Perborgen", "name": "Hein", "tags": "java, javascript, css, ruby, perl", "url": "https://github.com/Perborgen", "country": "Germany", "links": "https://Perborgen.wordpress.com/about" }] }, { "typeName": "LinkedIn", "records": [ { "country_code": "DE", "social_name": "linkedin", "name": "karussell", "last_name": "Peter", "skills": "java, objective-c, css, ruby, c#, python", "url": "https://linkedin.com/karussell", "country": "Germany" }, { "country_code": "DE", "social_name": "linkedin", "username": "Perborgen", "name": "Hein", "skills": "java, javascript, css, ruby, perl", "url": "https://linkedin.com/Perborgen", "country": "Germany" }] }]});
      this.setState({showTable : true}); 
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
    return (
      <div>
        <div className="header">
          <h2 className='title'>Elastic Search</h2>
          <div className="search">
            <span>
              <select value={this.state.countryCode} onChange={this.onInputChange} name="countryCode" className="h-25">
                <option value="AUS">Australia</option>
                <option value="IN">India</option>
                <option value="NZ">New Zealand</option>
                <option value="US">United States of America</option>
                <option value="UK">United Kingdom</option>
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
          {this.state.showTable && this.state.tables.map( tableData => <Table content={tableData} /> )}
        </div>
      </div>
    );  
  } 
}

export default App;
