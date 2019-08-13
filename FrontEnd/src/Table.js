import React from 'react';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshTable: false,
      tableName: props.tableName, records: props.records};
  }

  render () {
    return (
      <div>
        <h3 className="type">{this.state.tableName.toUpperCase()} <span className="count">({this.state.records.length})</span></h3>
        <table>
            {this.state.records.map((currentType, index) => 
                <React.Fragment>
                    {index === 0 && <tr className="headerRow"> { Object.keys(currentType).map(heading => <th>{heading}</th>) } </tr> }
                    <tr> { Object.values(currentType).map(value => <td>{value}</td>) } </tr>
                </React.Fragment>
            )}
        </table>

      </div>
    );
  }
}

export default Table;