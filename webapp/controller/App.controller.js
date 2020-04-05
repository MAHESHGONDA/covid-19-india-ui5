sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"com/covid19/india/libs/d3v4"
], function (Controller, JSONModel, Filter, d3v4) {
	"use strict";

	return Controller.extend("com.covid19.india.controller.App", {
		onInit: function () {
			this.statsInterval = null;
			this.selectedItem = null;
			this.data = null;
			this.covidModel = new JSONModel({
				data: [],
				topTenData: [],
				history: [],
				selectedData: {},
				selectedDataCountry: {},
				selectedCountry: "",
				bottomPanelVisible: true,
				// mobile: sap.ui.Device.system.phone,
				confirmedCasesIndian: true,
				confirmedCasesIndianState: true,
				chartType: "line",
				stateChartType: "line"
			});
			this.covidModel.setSizeLimit(1500);
			this.getView().setModel(this.covidModel);
			this.getCovidAllCountryData();
			this.stateSelected = null;
			// this.onCovidDataFail();

		},
		getLiveData: function () {
			this.statsInterval = setInterval(this.getCovidAllCountryData.bind(this), 300000);
			// setin(this.getCovidAllCountryData.bind(this), 60000);
		},

		getCovidAllCountryData: function () {
			this.getHistory();
			this.getCovidSAllStates();
			// this.covidModel.setProperty("/data", []);
			// // var oModel = new JSONModel(Device);
			// // oModel.loadData(https: //pomber.github.io/covid19/timeseries.json);
			// $.ajax({
			// 	// url: "https://pomber.github.io/covid19/timeseries.json",
			// 	// url: "https://coronavirus-19-api.herokuapp.com/countries",
			// 	url: "https://coronavirus-19-api.herokuapp.com/countries/india",
			// 	success: this.onCovidDataSuccess.bind(this),
			// 	error: this.onCovidDataFail.bind(this)
			// });
			//  
		},
		onCovidDataSuccess: function (aCountry) {
			this.data = aCountry;
			this.covidModel.setProperty("/selectedData", aCountry);
			this.getHistory();
			this.getCovidSAllStates();

		},
		onCovidDataFail: function (data) {
			// this.getHistory();
			// this.getCovidSAllStates();
		},
		getCovidSAllStates: function () {

			$.ajax({
				url: "https://api.rootnet.in/covid19-in/stats/latest",
				success: this.getCovidSAllStatesSuccess.bind(this),
				error: this.getCovidSAllStatesFail.bind(this)
			});

		},

		getHistory: function () {
			// 
			$.ajax({
				url: "https://api.rootnet.in/covid19-in/stats/history",
				success: this.onHistorySuccess.bind(this),
				error: this.onHistoryFail.bind(this)
			});
		},
		onHistorySuccess: function (data) {
			// history[0].summary.total
			this.covidModel.setProperty("/selectedData", data.data[data.data.length - 1]);
			debugger;
			this.covidModel.setProperty("/history", data.data);
		},
		onHistoryFail: function (data) {

		},

		onHistoryChange: function (oEvent) {

			// this.covidModel.setProperty("/history", this._datHistorySort(this.covidModel.getProperty("/history"), );
			var cases = oEvent.getSource().getSelectedKey();
			if (cases != "Confirmed") {
				this.covidModel.setProperty("/confirmedCasesIndian", false);
			} else {
				this.covidModel.setProperty("/confirmedCasesIndian", true);
			}
		},
		onChartTypeChange: function (oEvent) {

			// this.covidModel.setProperty("/history", this._datHistorySort(this.covidModel.getProperty("/history"), );
			var type = oEvent.getSource().getSelectedKey();
			if (type != "line") {
				this.covidModel.setProperty("/chartType", "bar");
			} else {
				this.covidModel.setProperty("/chartType", "line");
			}
		},
		onStateChartTypeChange: function (oEvent) {

			// this.covidModel.setProperty("/history", this._datHistorySort(this.covidModel.getProperty("/history"), );
			var type = oEvent.getSource().getSelectedKey();
			if (type != "line") {
				this.covidModel.setProperty("/stateChartType", "bar");
			} else {
				this.covidModel.setProperty("/stateChartType", "line");
			}
		},
		onStateHistoryChange: function (oEvent) {

			// this.covidModel.setProperty("/history", this._datHistorySort(this.covidModel.getProperty("/history"), );
			var cases = oEvent.getSource().getSelectedKey();
			if (cases != "Confirmed") {
				this.covidModel.setProperty("/confirmedCasesIndianState", false);
			} else {
				this.covidModel.setProperty("/confirmedCasesIndianState", true);
			}
		},
		_datHistorySort: function (data, order) {
			var sortedData = [];
			if (order == "ASC") {
				sortedData = data.sort(function (a, b) {
					return b.summary.total - a.summary.total;
				});
			} else {
				sortedData = data.sort(function (a, b) {
					return a.summary.total - b.summary.total;
				});
			}

			return sortedData;
		},
		_datSort: function (data, order) {

			if (order == "ASC") {
				this.regional = data.sort(function (a, b) {
					return b.confirmedCasesIndian - a.confirmedCasesIndian;
				});
			} else {
				this.regional = data.sort(function (a, b) {
					return a.confirmedCasesIndian - b.confirmedCasesIndian;
				});
			}

			return this.regional;
		},
		getCovidSAllStatesSuccess: function (data) {
			this.regional = this._datSort(data.data.regional, "ASC");

			this.covidModel.setProperty("/data", this.regional);
		},
		getCovidSAllStatesFail: function (error) {

		},
		setDefault: function () {
			var oCombobox = this.getView().byId("overviewId");
			// var selectedKey = oCombobox.getSelectedKey();
			if (this.selectedItem) {
				oCombobox.setSelectedKey(this.selectedItem.getKey());
				this.handleBottomPanelVisiblility();
			} else {
				this.handleBottomPanelVisiblility();
				oCombobox.setSelectedKey("Global");
				// oCombobox.setSelectedItem(oCombobox.getItems()[0]);
			}

			// var oEvent = new sap.ui.base.Event(oCombobox.getId(), oCombobox, this.global);
			oCombobox.fireSelectionChange();

		},
		onListUpdate: function (oEvent) {
			var aItems = oEvent.getSource().getItems();
			if (aItems.length) {
				// if(!this.stateSelected){
				oEvent.getSource().setSelectedItem(aItems[0]);
				oEvent.getSource().fireSelectionChange();

				// }
			}
		},
		onCountrySelect: function (oEvent) {

			var selectedItem = oEvent.getSource().getSelectedItem();
			this.handleBottomPanelVisiblility();
			// var selectedItem = oEvent.getParameter('selectedItem');
			if (selectedItem) {
				this.selectedItem = selectedItem;
				this.covidModel.setProperty("/selectedData", selectedItem.getBindingContext().getObject())
			}

		},
		handleBottomPanelVisiblility: function () {
			var oCombobox = this.getView().byId("overviewId");
			this.covidModel.setProperty("/selectedCountry", oCombobox.getSelectedKey());
			if (oCombobox.getSelectedKey() === "Global") {
				this.covidModel.setProperty("/bottomPanelVisible", false);
			} else {
				this.covidModel.setProperty("/bottomPanelVisible", true);
			}

		},
		onSearch: function (oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("loc", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oList = this.byId("idList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		},
		onListItemPress: function (oEvent) {
			var selectedItem = oEvent.getSource().getSelectedItem();
			if (selectedItem) {

				this.stateSelected = selectedItem.getBindingContext().getObject();
				this.covidModel.setProperty("/selectedDataCountry", this.stateSelected);

			}
			var splitApp = this.getView().byId("SplitContDemo")
				// splitApp.hideMaster()

		},
		onExit: function () {
			if (this.statsInterval) {
				clearInterval(this.statsInterval);
			}

		}
	});
});