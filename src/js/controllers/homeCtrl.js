'use strict';

angular.module('MarriottBreaks').controller('homeCtrl', [
    '$scope',
    '$rootScope',
    '$window',
    '$document',
    '$timeout',
    '$q','$modal', '$log',
    'breaksService',
    'statesService',
    'scrollService',
    'mediaService',
    'backgroundVideoService',
    'cookieService',
    'imagePlaceholderService',
    'schemaService',
    function($scope, $rootScope, $window, $document, $timeout, $q, $modal, $log, breaksService, statesService, scrollService, mediaService,
             backgroundVideoService, cookieService, imagePlaceholderService, schemaService){

        // set this to true once we get the breaks data from the server
        $scope.breaksDataLoaded = false;
        // start with search disabled until we load breaks
        $scope.disableSearch = true;

        $scope.isMobile = mediaService.isMobile();

        // Regions will be populated when accordion is built. This allows us to open/close via code
        // Example item: $scope.regionAccordionGroups['MIDWEST'] = {isOpen: false}
        $scope.regionAccordionGroups = {};
        // Manually add the top destinations group here
        $scope.regionAccordionGroups.TOPDEST = {isOpen: true};

        // Add statesService to the scope so we can use it in binding
        $scope.statesService = statesService;

        // Region Views
        $scope.REGION_VIEWS = {
            LIST: 'LIST',
            MAP: 'MAP'
        };

        if ($scope.isMobile){
            //$scope.selectedRegionView = $scope.REGION_VIEWS.LIST;
            $scope.selectedRegionView = $scope.REGION_VIEWS.MAP;

            $scope.showRegionOptions = false;
            $scope.searchPlaceholder = "Find Deals";

        }
        else {
            // Only allow map view if not mobile
            $scope.selectedRegionView = $scope.REGION_VIEWS.MAP;
            $scope.showRegionOptions = true;
            $scope.searchPlaceholder = "Where do you want to go?";
        }

    $scope.ModalPackage = {};
    $scope.open = function (region) {
        $scope.ModalPackage.selectedRegion = region;
        $scope.ModalPackage.RegionLabel = (region=="CANADA" || region=="CARRIBEAN & LATIN AMERICA"?"":" Region");
        $scope.ModalPackage.selectedRegionFormatted = region.replace(/\w[^\s-]*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        $scope.ModalPackage.regions = $scope.regions;
        $scope.ModalPackage.statesService = $scope.statesService;

        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            items: function () {
              return $scope.ModalPackage;
            }
          }
        });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;

                $scope.stateButtonClick(selectedItem);

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.selectedTopDestination = null;

        $scope.selectRegionView = function(viewType){
            if (viewType === 'LIST') {

                var newHeight;
                if (window.innerWidth < 350) {
                    newHeight = 600;
                } else if (window.innerWidth < 400) {
                    newHeight = 580;
                } else if (window.innerWidth < 450) {
                    newHeight = 560;
                } else if (window.innerWidth < 500){
                    newHeight = 540;
                } else if (window.innerWidth < 550){
                    newHeight = 540;
                } else if (window.innerWidth < 600) {
                    newHeight = 540;
                } else if (window.innerWidth < 650) {
                    newHeight = 540;
                } else if (window.innerWidth < 700) {
                    newHeight = 540;
                } else if (window.innerWidth < 800) {
                    newHeight = 540;
                } else if (window.innerWidth < 900) {
                    newHeight = 540;
                } else if (window.innerWidth < 1000) {
                    newHeight = 540;
                } else if (window.innerWidth < 1100) {
                    newHeight = 540;
                } else if (window.innerWidth < 1200) {
                    newHeight = 540;
                } else { // > 1200
                    newHeight = 540;
                }

                var videoDiv = $document.find("#background-video");  // Default is min-height: 690px;
                if (videoDiv.height() < newHeight) {
                    videoDiv.height(newHeight);
                }
            }
            $scope.selectedRegionView = viewType;
        };

        $scope.toggleTopDestination = function(topDestination){
            // Collapse the item if it is already selected
            var topDestinationResult = ($scope.selectedTopDestination === topDestination) ? null : topDestination;
            selectTopDestination(topDestinationResult);
            scrollService.scrollToElement($document.find('.top-destination-accordion'));
        };

        $scope.isRegionViewActive = function(viewType){
            return $scope.selectedRegionView === viewType;
        };

        $scope.inputItemSelected = function($model){
            // scroll to item if model is valid and not a placeholder (isPlaceholder will be true if this is the
            // "No hotels match" message)
            if ($model && !$model.isPlaceholder){
                //$window.location.href = $model.PROPERTY_PAGE_URL;
                expandRegion($model.REGION);
                scrollService.scrollToState($model.PROPERTY_STATE);
            }
        };

        $scope.stateRegionButtonClick = function(regionOrState){
            //expandRegion(regionOrState);
            var regionOrStateSpaces = regionOrState.replace(/_/g, ' ');

            if ($scope.regions[regionOrStateSpaces]) {
                $scope.open(regionOrStateSpaces);
            } else {
                // Expand the region and scroll to the state
                console.log("Here is what the format should be:", $scope.regions);

                var regionObject = {'MOUNTAIN': {'states':{'MT':1, 'WY':1, 'UT': 1,'CO':1, 'AZ':1, 'NM':1}},
                    'PACIFIC': {'states':{'WA':1,'ID':1,'OR':1,'CA':1,'NV':1,'AK':1,'HI':1}},
                    'MIDWEST': {'states':{'ND':1,'SD':1,'MN':1,'WI':1,'IA':1,'IL':1, 'IN':1,'MI':1,'OH':1}},
                    'SOUTH CENTRAL': {'states':{'NE':1,'KS':1,'MO':1,'OK':1,'TX':1,'AR':1,'LA':1,'KY':1}},
                    'SOUTHEAST': {'states':{'TN':1,'MS':1,'AL':1,'GA':1,'FL':1,'SC':1,'NC':1}},
                    'MID-ATLANTIC': {'states':{'VA':1,'WV':1,'MD':1,'DE':1,'PA':1,'NJ':1}},
                    'NEW ENGLAND': {'states':{'NY':1,'VT':1,'NH':1,'RI':1,'MA':1,'CT':1,'ME':1}}};

                /*MIDWEST: Object
                states: Object
                IL: 10
                IN: 5
                MI: 2
                OH: 8
                SD: 5 $scope.regions
                */


                var region = breaksService.getRegionFromState(regionObject, regionOrStateSpaces);
                $scope.open(region);
                //if (region){
                //    expandRegion(region);
                //}

                // Hide all states for this region
                /* COMMENTED OUT - ALWAYS SHOW ALL STATES
                 angular.forEach($scope.regions[region].states, function(value, key) {

                 if ($scope.regionAccordionGroups.hasOwnProperty(key)) {
                 $scope.regionAccordionGroups[key].isHidden = true;
                 }
                 else
                 {
                 $scope.regionAccordionGroups[key] = {isHidden: true};
                 }
                 });
                 // Show this state
                 if ($scope.regionAccordionGroups.hasOwnProperty(state)) {
                 $scope.regionAccordionGroups[state].isHidden = false;
                 }
                 else
                 {
                 $scope.regionAccordionGroups[state] = {isHidden: false};
                 }
                 */
                //$scope.selectedTopDestination = null;
                //scrollService.scrollToState(regionOrStateSpaces);
                //scrollService.scrollToElement($document.find('.your-ebreaks-bar'));
            }
        };

        $scope.stateButtonClick = function(regionOrState){
            var regionOrStateSpaces = regionOrState.replace(/_/g, ' ');
            if ($scope.regions[regionOrStateSpaces]) {
                $scope.open(regionOrStateSpaces);
            } else {
                // Expand the region and scroll to the state

                var region = breaksService.getRegionFromState($scope.regions, regionOrStateSpaces);
                if (region){
                    expandRegion(region);
                }
                
                // Hide all states for this region
                /* COMMENTED OUT - ALWAYS SHOW ALL STATES
                angular.forEach($scope.regions[region].states, function(value, key) {                
                    
                    if ($scope.regionAccordionGroups.hasOwnProperty(key)) {
                        $scope.regionAccordionGroups[key].isHidden = true;
                    }
                    else
                    {
                        $scope.regionAccordionGroups[key] = {isHidden: true};
                    }
                });
                // Show this state
                if ($scope.regionAccordionGroups.hasOwnProperty(state)) {
                    $scope.regionAccordionGroups[state].isHidden = false;
                }
                else
                {
                    $scope.regionAccordionGroups[state] = {isHidden: false};
                }
                */
                $scope.selectedTopDestination = null;
                scrollService.scrollToState(regionOrStateSpaces);
                //scrollService.scrollToElement($document.find('.your-ebreaks-bar'));
            }
        };

        $scope.formatRegionName = function(region){
            //var regionFormatted = region.toLowerCase(); \w\S*
            //return regionFormatted.charAt(0).toUpperCase() + regionFormatted.slice(1);
            if ($scope.isMobile && region == "CARRIBEAN & LATIN AMERICA") {
                region = "Carribean & Mexico";
            }
            return region.replace(/\w[^\s-]*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };

        // Load the previous search info on pageshow since initialize won't be called again if bfcache (back/forward caching) is being used.
        angular.element($window).on('pageshow', function(){
            $scope.$apply(function(){
                $scope.disableSearch = false;
            });
        });

        $rootScope.$on('window.resize', function () {
            updateMediaOptions();
        });

        var attemptedScroll = false;
        $scope.$watchCollection('regionAccordionGroups', function(newVal){
            // wait until region groups have been built via the DOM ng-repeat before trying to scroll to the hotel items
            if (!attemptedScroll && Object.keys(newVal).length > 1){
                attemptedScroll = true;
                goToLastVisitedItem();
            }
        });

        function initialize() {
            // get the breaks data
            breaksService.get().then(getBreaksSuccess, getBreaksFail);
            // get the schema data and inject it into a script tag
            schemaService.getAndInjectSchemaData();
        }

        // update controller options based on media size
        function updateMediaOptions(){
            $scope.isMobile = mediaService.isMobile();

            $scope.showRegionOptions = true;
            if ($scope.isMobile) {
                $scope.showRegionOptions = false;

                // if we are changing from mobile to non-mobile, we need to move off of the map view
                //if ($scope.selectedRegionView === $scope.REGION_VIEWS.MAP){
                //    $scope.selectedRegionView = $scope.REGION_VIEWS.LIST;
                //}

                backgroundVideoService.hideVideo();
            }
            else {
                $scope.showRegionOptions = true;
                backgroundVideoService.showVideo();
            }
        }

        function selectTopDestination(topDestination){
            collapseRegions();
            $scope.selectedTopDestination = topDestination;
            scrollService.scrollToRegion('TOPDEST');
        }

        function expandRegion(region){
            $scope.aRegionIsExpanded = true;
            angular.forEach($scope.regionAccordionGroups, function(value, key) {
                $scope.regionAccordionGroups[key].isOpen = false;
            });
            if ($scope.regionAccordionGroups.hasOwnProperty(region)){
                $scope.regionAccordionGroups[region].isOpen = true;
            }
        }

        function collapseRegions(){
            $scope.aRegionIsExpanded = false;
            angular.forEach($scope.regionAccordionGroups, function(value, key) {
                $scope.regionAccordionGroups[key].isOpen = false;
            });
        }

        function getBreaksSuccess(response){
            //TODO: this is for testing purposes only. Remove once we have real hotel image URLs
            imagePlaceholderService.setPlaceholderImagesForBreaks(response.data.breaks);

            $scope.breaks = response.data.breaks;
            $scope.regions = response.data.regions;
            $scope.topDestinations = response.data.topDestinations;

            $scope.breaksDataLoaded = true;
            $scope.disableSearch = false;

            // Grab start & end dates from first eBreak - format: 20150430 20150503
            var OfferStartDateString = String($scope.breaks[0].OFFER_START_DATE);
            var OfferEndDateString = String($scope.breaks[0].OFFER_END_DATE);

            var StartYear = OfferStartDateString.substring(0,4);
            var EndYear = OfferEndDateString.substring(0,4);
            var StartMonth = OfferStartDateString.substring(4,6);
            var EndMonth = OfferEndDateString.substring(4,6);

            var OfferStartDate = new Date(StartYear, StartMonth - 1, OfferStartDateString.substring(6,8));
            var OfferEndDate   = new Date(EndYear, EndMonth - 1, OfferEndDateString.substring(6,8));

            var month = new Array();
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";

            var shortMonth = new Array();
            shortMonth[0] = "Jan";
            shortMonth[1] = "Feb";
            shortMonth[2] = "March";
            shortMonth[3] = "April";
            shortMonth[4] = "May";
            shortMonth[5] = "June";
            shortMonth[6] = "July";
            shortMonth[7] = "Aug";
            shortMonth[8] = "Sept";
            shortMonth[9] = "Oct";
            shortMonth[10] = "Nov";
            shortMonth[11] = "Dec";

            var endYear = ", " + OfferEndDate.getFullYear();
            if (StartMonth == EndMonth)
            {
                // Only list month once
                var formattedStartDateRange = month[OfferStartDate.getMonth()] + " " + OfferStartDate.getDate();
                var formattedEndDateRange = OfferEndDate.getDate();
            }
            else
            {
                // List both start month and end month
                if (StartYear == EndYear)
                {
                    // Years are same, so don't show year in Start Date
                    var formattedStartDateRange = shortMonth[OfferStartDate.getMonth()] + " " + OfferStartDate.getDate();
                }
                else
                {
                    // Years are different, so do show year in Start Date
                    var formattedStartDateRange = shortMonth[OfferStartDate.getMonth()] + " " + OfferStartDate.getDate() + ", " + OfferStartDate.getFullYear();
                }
                // Always show year in End Date
                var formattedEndDateRange = shortMonth[OfferEndDate.getMonth()] + " " + OfferEndDate.getDate();
            }

            $scope.StartDateRange = formattedStartDateRange;
            $scope.EndDateRange = formattedEndDateRange;
            $scope.EndYear = endYear;

            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
            var today = new Date();

            $scope.offerDaysLeft = Math.round(Math.abs((today.getTime() - OfferEndDate.getTime())/(oneDay)));
        }

        function getBreaksFail(response){
            //TODO: Error handling?
        }

        function goToLastVisitedItem(){
            var lastVisitedHotel = cookieService.getLastVisitedHotel();

            if (lastVisitedHotel){

                // try to expand the section containing the hotel. this needs to happen first, especially for top destinations
                // because top dests aren't loaded in the DOM yet
                if (expandLastVisitedHotelSection(lastVisitedHotel)){

                    // we need a timeout here so that DOM content can load after expanding
                    $timeout(function(){

                        // try to find the hotel in the DOM
                        var hotelElement = $document.find('#' + lastVisitedHotel.id);

                        // if we find the hotel element, scroll to it
                        if (hotelElement.length > 0){
                            scrollService.scrollToElement(hotelElement, 10);
                        }
                        else {
                            // we couldn't find the exact hotel, so scroll to the next most relevant section
                            if (lastVisitedHotel.topDestination){
                                // for top destination, just scroll to the top destinations section
                                scrollService.scrollToRegion('TOPDEST');
                            }
                            else {
                                /* for regular destinations, first try to scroll to the state. If we can't find that,
                                 just scroll to the region */
                                /*  COMMMENTING OUT AS WE NOW HIDE OTHER REGIONS & STATES AND SHOULD SCROLL TO "YOUR EBREAKS" BAR */
                                var stateElement = $document.find('#STATE_' + lastVisitedHotel.state);
                                if (stateElement.length > 0){
                                    scrollService.scrollToElement(stateElement);
                                }
                                else {
                                    scrollService.scrollToRegion(lastVisitedHotel.region);
                                }

                                // Scroll to the Your eBreaks bar
                                scrollService.scrollToElement($document.find('.your-ebreaks-bar'));
                            }
                        }
                    }, 1000);
                }

                //remove the cookie so that it only happens once
                cookieService.removeLastVisitedHotel();
            }
        }

        // expand the correct hotel section to allow scrolling to it. returns true if the valid section was found and expanded
        function expandLastVisitedHotelSection(lastVisitedHotel){
            if (lastVisitedHotel.topDestination){
                // for top destination, expand the top destination group and open the correct section
                // check to see if this is a valid top destination first
                if ($scope.topDestinations.indexOf(lastVisitedHotel.topDestination) !== -1){
                    $scope.regionAccordionGroups.TOPDEST.isOpen = true;
                    selectTopDestination(lastVisitedHotel.topDestination);

                    return true;
                }
            }
            else {
                // make sure this is a valid region before trying to expand
                if ($scope.regionAccordionGroups.hasOwnProperty(lastVisitedHotel.region)){
                    expandRegion(lastVisitedHotel.region);
                    return true;
                }
            }

            return false;
        }

        initialize();

    }
]);

angular.module('MarriottBreaks').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.statesService = items.statesService;
  //$scope.region = region;
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.reposition = function () {
    $modalInstance.reposition();
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});