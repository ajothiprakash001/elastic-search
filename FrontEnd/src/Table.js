import React from 'react';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tableContent: props.content};
  }
  render () {
    const records = this.state.tableContent.records;

    return (
      <div>
        <h3 className="type">{this.props.content.typeName} <span className="count">({this.props.content.records.length})</span></h3>
        <table>
            {records.map((currentType, index) => 
                <React.Fragment>
                    {index === 0 && <tr> { Object.keys(currentType).map(heading => <th>{heading}</th>) } </tr> }
                    <tr> { Object.values(currentType).map(value => <td>{value}</td>) } </tr>
                </React.Fragment>
            )}
        </table>

      </div>
    );
  }
}

export default Table;