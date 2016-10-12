function map() {

	if (typeof google === 'undefined') {
			alert('ERROR: Google maps failed to load');
		}

	/* --------------------- Model Data ---------------------- */

	var Model = {
		// options to set up our google map
		mapOptions: {
			center: {lat: 34.069952, lng: -118.445288},
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			mapTypeControlOptions: {
				position: google.maps.ControlPosition.TOP_CENTER
			},
			panControlOptions: {
				position: google.maps.ControlPosition.LEFT_TOP
			},
			zoomControlOptions: {
				position: google.maps.ControlPosition.LEFT_CENTER
			}
		},

		// our basic location array
		locations: [
			{
				name: 'UCHA housing co-op',
				type: 'stop',
				description: 'this is a pokestop',
				coordinates: {
					lat: 34.068852,
					lng: -118.450761
				}
			},
			{
				name: 'Powell Library',
				type: 'gym',
				description: 'this is a gym',
				coordinates: {
					lat: 34.072108,
					lng: -118.442026
				}
			}
		],

		// info to make our ajax request to four square
		fourSquareInfo: {
			clientID: 'AQCNP0VHT3VAKMLMIUH2OQHNP2XHXOWYFSYEJNJ0RSKR1JHA',
			clientSecret: 'VGTBLMPURRGIG4NSSIATQTTEUWKSWPWVKOHNDCECXCDVCEJB',
			version: 20130815
		},

		// programmatically set the icon color which goes
		// with the right location type
		setLocationIcon: function() {
			// define variables outside the for loop
			var i, color, location, locationType;
			var locationsLength = Model.locations.length;

			for (i = 0; i < locationsLength; i++) {
				location = Model.locations[i];
				locationType = location.type;

				// colors according to filterOptions array below
				if (locationType === 'gym')
					color = 'red';
				else if (locationType === 'stop')
					color = 'blue';

				location.icon = 'resources/' + color + '-dot.png';
			}
		},

		infoWindowContent: null,

		// sets the info window content
		makeInfoWindow: function(i, markerCopy) {
			Model.infoWindowContent = Model.locations[i].description;
			// once done constructing info window content,
			// call on VM to set info window to right marker
			myViewModel.setUpInfoWindow(markerCopy);
		},

		// categories to filter the locations
		filterOptions: [
			{
				name: 'all',
				image: null
			},
			{
				name: 'gym',
				image: 'resources/red-dot.png'
			},
			{
				name: 'stop',
				image: 'resources/blue-dot.png'
			}
		]
	};


	/* --------------------- ViewModel ----------------------*/

	var ViewModel = function() {
		var self = this;

		Model.setLocationIcon();
		// listen to the search box for changes
		self.query = ko.observable('');

		// put show options in VM to construct it in DOM using KO
		self.filterOptionsList = [];
		Model.filterOptions.forEach(function(element) {
			self.filterOptionsList.push(element);
		});

		// put locations in VM to construct listview in DOM using KO
		self.locationsList = [];
		Model.locations.forEach(function(element) {
			self.locationsList.push(element);
		});

		// put locations length in VM for use in search and show functions
		self.locationsListLength = self.locationsList.length;

		// make an array to hold each marker
		self.markersList = [];
		console.log(self.markersList);

		// when a marker is clicked, open an info window and animate the marker
		self.makeInfoWindow = function(i, markerCopy) {
			// the click event handler for each marker
			google.maps.event.addListener(markerCopy, 'click', function() {
				// model constructs info window content for each location
				Model.makeInfoWindow(i, markerCopy);
			});
		};

		self.setUpInfoWindow = function(markerCopy) {
			var infoWindow = self.infoWindow;
			// set the right content
			infoWindow.setContent(Model.infoWindowContent);
			// open the info window when a marker is clicked
			infoWindow.open(self.map, markerCopy);

			self.setUpMarkerAnimation(markerCopy);
		};

		self.setUpMarkerAnimation = function(markerCopy) {
			// make any previously clicked marker stop bouncing
			self.markersList.forEach(function(element) {
				element.setAnimation(null);
			});
			// make the clicked marker bounce
			markerCopy.setAnimation(google.maps.Animation.BOUNCE);
			// stop bouncing the marker when you close the info window
			google.maps.event.addListener(self.infoWindow, 'closeclick', function() {
				markerCopy.setAnimation(null);
			});
		};

		// link each list item to the correct info window
		self.makeListClickable = function(index) {
			console.log(self.markersList[index()]);
			google.maps.event.trigger(self.markersList[index()], 'click');
			self.hideList();
		};

		self.hideList = function() {
			if ($(window).width() < 750) {
				$('.list-container').hide();
				$('.show-locations').show();
			}
		};

		self.showList = function() {
			$('.list-container').show();
			$('.show-locations').hide();
		};

		self.search = function() {
			var searchValue = new RegExp(self.query(), 'i');
			var i, result;

			// reset everything
			self.infoWindow.close();
			// first make all markers show on screen
			self.markersList.forEach(function(element) {
				element.setAnimation(null);
				element.setMap(self.map);
			});
			// and make all list items show on screen
			$('.list-item').show();

			for (i = 0; i < self.locationsListLength; i++) {
				// test if search query matches any location names
				result = searchValue.test(self.locationsList[i].name);
				// if the search query does not match a location name,
				// hide its marker and list item
				if (result === false) {
					self.markersList[i].setMap(null);

					$('#' + i).hide();
				}
			}
		};
		// if changes in the search box, call the search function
		self.query.subscribe(self.search);

		// name is the category clicked by the user
		self.setUpCategoryFilter = function(name) {
			var i, result;

			// reset everything
			self.infoWindow.close();
			// first show all markers and list items on screen
			self.markersList.forEach(function(element) {
				element.setAnimation(null);
				element.setMap(self.map);
			});
			$('.list-item').show();

			// if the user clicked a category instead of all
			if (name !== 'all') {
				for (i = 0; i < self.locationsListLength; i++) {
					// save each location's type
					result = self.locationsList[i].type;
					// if the location's type does not equal the category
					// clicked, hide its marker and list item
					if (result !== name) {
						self.markersList[i].setMap(null);

						$('#' + i).hide();
					}
				}
			}
		};

		// initialize the map
		self.initializeMap = function() {
			// create the map
			var mapCanvas = document.getElementById('map-canvas');
			self.map = new google.maps.Map(mapCanvas, Model.mapOptions);

			// declare variables outside of the loop
			var locations = self.locationsList;
			var locationsLength = locations.length;
			var i, marker;
			// make one info window
			self.infoWindow = new google.maps.InfoWindow({
				maxWidth: 300,
			});
			console.log(locationsLength);
			// for loop makes markers with info windows
			for (i = 0; i < locationsLength; i++) {
				// make markers
				marker = new google.maps.Marker({
					position: locations[i].coordinates,
					icon: locations[i].icon
				});
				marker.setMap(self.map);
				// add each marker to an array
				self.markersList.push(marker);
				// add info windows
				self.makeInfoWindow(i, marker);
				console.log(marker);
			}
		};

		self.initializeMap();

		// prevent form from submitting when user presses enter key
		$(document).on('keypress', 'form', function(e) {
			var code = e.keyCode || e.which;

			if (code === 13) {
				e.preventDefault();

				return false;
			}
		});
	};

	// allows us to reference our instance of the ViewModel
	var myViewModel = new ViewModel();

	ko.applyBindings(myViewModel);
}