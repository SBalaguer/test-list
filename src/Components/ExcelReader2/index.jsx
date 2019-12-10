import React, { Component } from "react";
import * as XLSX from "xlsx";

export class GetDataFromExcelJusTInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoja: "",
      hojas: [],
      file: false,
      newHojas: [],
      listasClientes: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.createClientObj = this.createClientObj.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    const this2 = this;
    this.setState({
      [name]: value
    });
    let hojas = [];
    if (name === "file") {
      let reader = new FileReader();
      reader.readAsArrayBuffer(target.files[0]);
      reader.onloadend = e => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });

        workbook.SheetNames.forEach(function(sheetName) {
          // Here is your object
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheetName]
          );
          hojas.push({
            data: XL_row_object,
            sheetName
          });
        });
        this2.setState({
          selectedFileDocument: target.files[0],
          hojas
        });
      };
    }
  }

  createClientObj() {
    //let clientNumb = this.state.hojas[5].data[0]["Número de Cliente"];
    let clientNumb = this.state.hojas[5].data;
    //importing all information
    let clienteObj = [...this.state.hojas[0].data];
    let listZWMD = this.state.hojas[1].data; //Depende de cliente y categoria
    let listZCD8 = this.state.hojas[2].data; //Depende de cliente
    let listZSCKD_ZPYC_ZEPY = this.state.hojas[3].data; //Depende solo de num de cliente
    let listZBDF = this.state.hojas[4].data; // Depende de cliente y de EAN
    let AEs = this.state.hojas[5].data;


    clientNumb.map(customer => {
      const cliente = customer["Número de Cliente"];
      
      //create list price for customer in cliente
      const listaCliente = [...this.state.hojas[0].data].map(producto => {
        const cat = producto["CATEGORÍA"];
        const ean = producto["EAN - 13"];

        //calculo ZSCKD, ZPYC y ZEPY
        for (let i = 0; i < listZSCKD_ZPYC_ZEPY.length; i++) {
          if (listZSCKD_ZPYC_ZEPY[i]["Número de Cliente"] === cliente) {
            producto.ZSCKD = listZSCKD_ZPYC_ZEPY[i]["Descuento 2"];
            producto.ZPYC = listZSCKD_ZPYC_ZEPY[i]["Descuento 3"];
            producto.ZEPY = listZSCKD_ZPYC_ZEPY[i]["Descuento 4"];
          }
        }

        //calculo ZCD8
        for (let i = 0; i < listZCD8.length; i++) {
          if (listZCD8[i]["Número de Cliente"] === cliente) {
            producto.ZCD8 = listZCD8[i]["Descuento 1.5"];
          }
        }

        //calculo ZWMD
        for (let i = 0; i < listZWMD.length; i++) {
          if (
            listZWMD[i]["Número de Cliente"] === cliente &&
            listZWMD[i]["Categoría"] === cat
          ) {
            producto.ZWMD = listZWMD[i]["Descuento 1"];
          }
        }

        //calculo ZBDF
        for (let i = 0; i < listZBDF.length; i++) {
          if (
            listZBDF[i]["Número de Cliente"] === cliente &&
            listZBDF[i]["EAN"] === ean
          ) {
            producto.ZBDF = listZBDF[i]["Descuento 5"];
          }
        }
        return producto;
      });
      
      const listasClientes = [...this.state.listasClientes, { cliente: cliente, listaCliente }];
      this.setState({
        listasClientes
      });

      console.log(listaCliente)

      // console.log(listaCliente[0]["ZSCKD"]);
      // console.log(listaCliente[0]["ZPYC"]);
      // console.log(listaCliente[0]["ZEPY"]);
      // console.log(listaCliente[0]["ZCD8"]);
      // console.log(listaCliente[0]["ZWMD"]);
      // console.log(listaCliente[0]["ZBDF"]);
    });
  }

  render() {
    console.log(this.state.listasClientes)
    const { handleInputChange } = this;
    return (
      <div>
        <input
          required
          type="file"
          name="file"
          id="file"
          onChange={handleInputChange}
          placeholder="Archivo de excel"
        />
        <button onClick={() => this.createClientObj()}>
          Create Client Ojb
        </button>
      </div>
    );
  }
}

export default GetDataFromExcelJusTInput;
