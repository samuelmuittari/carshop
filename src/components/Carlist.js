import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Addcar from "./Addcar";
import EditCar from "./EditCar";


export function Carlist() {
  // PITÄISI LUODA TILA, JOHON SAADAAN LISTA AUTOJA
  const [cars, setCars] = useState([]);
  // PITÄISI HAKEA REST-RAJAPINNASTA AUTOT
  // MIKÄ HOOK-FUNKTIO?

  useEffect(() => {
    console.log("OLLAAN HOOK FUNKTIOSSA");
    fetchCars();
    
  }, []);

  const addCar = (car) => {
    console.log("Carlist.js tiedoston addCar metodissa");
    // REST RAJAPINTAA KÄYTTÄEN PITÄISI SAADA AUTO LISÄTTYÄ
    fetch("https://carrestapi.herokuapp.com/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    }).then((response) => {
      if (response.ok) {
        fetchCars();
      }
    });
  };

  const fetchCars = () => {
    // TÄHÄN TULEE FETCH, JOLLA HAETAAN TIEDOT
    // AUTOISTA
    fetch("https://carrestapi.herokuapp.com/cars")
      .then((response) => response.json())
      .then((data) => setCars(data._embedded.cars));
  };

  const deleteCar = (link) => {
    console.log("DELETE FUNKTIO");
    fetch(link, { method: "DELETE" }).then((response) => {
      if (response.ok) {
        fetchCars();
      }
    });
  };

  const updateCar = (updateCar, link) => {
    console.log(" UPDATE FUNKTIO");
    fetch(link, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateCar),
    }).then((response) => {
      if (response.ok) {
        fetchCars();
      }
    });
  };

  const [columnDefs, setColumnDefs] = useState([
    { field: "brand", sortable: true, filter: true },
    { field: "model", sortable: true, filter: true },
    { field: "color", sortable: true, filter: true },
    { field: "fuel", sortable: true, filter: true },
    { field: "year", sortable: true, filter: true },
    { field: "price", sortable: true, filter: true },
    {
      headerName: "",
      width: 100,
      field: "_links.self.href",
      cellRenderer: (params) => (
        
        <IconButton color="error" onClick={() => deleteCar(params.value)}>
          <DeleteIcon />
        </IconButton>

        

      ),
    },
    {
      headerName: "",
      width: 100,
      field: "_links.self.href",
      cellRenderer: (params) => (
        <EditCar updateCar={updateCar}  params={params} />

      ),
    },
  ]);

  return (
    <>
    
      <Addcar addCar={addCar} />
      <div style={{ height: "100%", boxSizing: "border-box" }}>
        <div
          style={{ height: 600, width: "90%" }}
          className="ag-theme-material"
        >
          <AgGridReact
            rowData={cars}
            columnDefs={columnDefs}
            paginationPageSize={10}
            pagination={true}
          />
        </div>
      </div>
    </>
  );
}

export default Carlist;