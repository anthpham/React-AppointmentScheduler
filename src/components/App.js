import React, { Component } from "react";
import "../css/App.css";

import AddAppointments from "./AddAppointments";
import SearchAppointments from "./SearchAppointments";
import ListAppointments from "./ListAppointments";

import { findIndex, without } from "lodash";

class App extends Component {
  constructor() {
    super();
    this.state = {
      myAppointments: [],
      formDisplay: false,
      orderBy: "petName",
      orderDir: "asc",
      queryText: "",
      lastIndex: 0,
    };
    this.deleteAppointment = this.deleteAppointment.bind(this); //allows deleteAppointment to make "this" refer to this component
    this.toggleForm = this.toggleForm.bind(this); //allows toggleForm to make "this" refer to this component
    this.addAppointment = this.addAppointment.bind(this); //allows addAppointment to make "this" refer to this component
    this.changeOrder = this.changeOrder.bind(this); //allows changeOrder to make "this" refer to this component
    this.searchApts = this.searchApts.bind(this); //allows searchApts to make "this" refer to this component
    this.updateInfo = this.updateInfo.bind(this); //allows updateInfo to make "this" refer to this component
  }

  toggleForm() {
    //toggles visibility of add appointment form
    this.setState({
      formDisplay: !this.state.formDisplay,
    });
  }

  searchApts(query) {
    //sets queryText to the query
    this.setState({ queryText: query });
  }

  changeOrder(order, dir) {
    //changes order of apts based on order and direction
    this.setState({
      orderBy: order,
      orderDir: dir,
    });
  }

  updateInfo(name, value, id) {
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments, {
      aptId: id,
    });
    tempApts[aptIndex][name] = value;
    this.setState({
      myAppointments: tempApts,
    });
  }

  addAppointment(apt) {
    //function for adding apointments
    let tempApts = this.state.myAppointments; //temporary apt var that holds current val of myAppointments
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt); //adds new apt to beginning of array, return new length
    this.setState({
      //sets the state to new version of array, increments lastIndex
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1,
    });
  }

  deleteAppointment(apt) {
    let tempApts = this.state.myAppointments; //temporary apt var that holds current val of myAppointments
    tempApts = without(tempApts, apt); //returns array without apt

    this.setState({
      //sets the state to new version of array
      myAppointments: tempApts,
    });
  }

  componentDidMount() {
    //React lifecycle method, between constructor and render
    fetch("./data.json") //using fetch api, works with promises, use JS then method
      .then((response) => response.json()) //response comes in as json formated object
      .then((result) => {
        //take that result, convert it to something else
        const apts = result.map((item) => {
          //create an object apts, use JS map function to map every item to
          item.aptId = this.state.lastIndex;
          this.setState({ lastIndex: this.state.lastIndex + 1 });
          return item;
        });
        this.setState({
          //neer modify state directly like this.state =...
          myAppointments: apts,
        });
      });
  }

  render() {
    //handles sorting
    let order;
    let filteredApts = this.state.myAppointments;
    if (this.state.orderDir === "asc") {
      //if ascending
      order = 1;
    } else {
      order = -1; //descending
    }

    filteredApts = filteredApts
      .sort((a, b) => {
        if (
          a[this.state.orderBy].toLowerCase() <
          b[this.state.orderBy].toLowerCase()
        ) {
          return -1 * order; //order allows you to reorder sort according to asc or desc
        } else {
          return 1 * order;
        }
      })
      .filter((eachItem) => {
        //filters by checking each apt for match to query text by pet name, ownder, then apt notes
        return (
          eachItem["petName"]
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase()) ||
          eachItem["ownerName"]
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase()) ||
          eachItem["aptNotes"]
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase())
        );
      });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointment={this.addAppointment}
                />
                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  searchApts={this.searchApts}
                />
                <ListAppointments
                  appointments={filteredApts}
                  deleteAppointment={this.deleteAppointment}
                  updateInfo={this.updateInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
