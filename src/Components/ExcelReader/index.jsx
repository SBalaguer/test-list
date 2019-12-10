import React, { Component } from "react";
import XLSX from 'xlsx'
import workbook from './../../data/receipts.xls'

class ExcelReader extends Component {
    /* convert from workbook to array of arrays */
  

  /* convert from array of arrays to workbook */
  // var worksheet = XLSX.utils.aoa_to_sheet(data);
  // var new_workbook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
  render() {
    var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
    var data = XLSX.utils.sheet_to_json(first_worksheet, {header:1});
    console.log(data)
    return (
      <div>
        <h1>Here goes the Excel Reader</h1>
        
      </div>
    );
  }
}

export default ExcelReader;
