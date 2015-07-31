'use strict';

angular.module('MarriottBreaks').factory('statesService', [
    function(){

        var states = {
            'AL': 'Alabama',
            'AK': 'Alaska',
            'AS': 'American Samoa',
            'AZ': 'Arizona',
            'AR': 'Arkansas',
            'CA': 'California',
            'CO': 'Colorado',
            'CT': 'Connecticut',
            'DE': 'Delaware',
            'DC': 'District Of Columbia',
            'FM': 'Federated States Of Micronesia',
            'FL': 'Florida',
            'GA': 'Georgia',
            'GU': 'Guam',
            'HI': 'Hawaii',
            'ID': 'Idaho',
            'IL': 'Illinois',
            'IN': 'Indiana',
            'IA': 'Iowa',
            'KS': 'Kansas',
            'KY': 'Kentucky',
            'LA': 'Louisiana',
            'ME': 'Maine',
            'MH': 'Marshall Islands',
            'MD': 'Maryland',
            'MA': 'Massachusetts',
            'MI': 'Michigan',
            'MN': 'Minnesota',
            'MS': 'Mississippi',
            'MO': 'Missouri',
            'MT': 'Montana',
            'NE': 'Nebraska',
            'NV': 'Nevada',
            'NH': 'New Hampshire',
            'NJ': 'New Jersey',
            'NM': 'New Mexico',
            'NY': 'New York',
            'NC': 'North Carolina',
            'ND': 'North Dakota',
            'MP': 'Northern Mariana Islands',
            'OH': 'Ohio',
            'OK': 'Oklahoma',
            'OR': 'Oregon',
            'PW': 'Palau',
            'PA': 'Pennsylvania',
            'PR': 'Puerto Rico',
            'RI': 'Rhode Island',
            'SC': 'South Carolina',
            'SD': 'South Dakota',
            'TN': 'Tennessee',
            'TX': 'Texas',
            'UT': 'Utah',
            'VT': 'Vermont',
            'VI': 'Virgin Islands',
            'VA': 'Virginia',
            'WA': 'Washington',
            'WV': 'West Virginia',
            'WI': 'Wisconsin',
            'WY': 'Wyoming'
        };

        // Get an inverted list as well ('Michigan':'MI') for easier search, rather than looping through each time
        // we need to get the abbreviation by state name.
        var statesInverted = getStatesInverted();

        function getStatesInverted(){
            var inverted = {};

            for (var prop in states){
                if (states.hasOwnProperty(prop)){
                    inverted[states[prop]] = prop;
                }
            }

            return inverted;
        }

        return {

            getStateName: function(stateAbbreviation){
                return (states[stateAbbreviation] ? states[stateAbbreviation] : stateAbbreviation);
            },

            getStateAbbreviation: function(stateName){
                return statesInverted[stateName];
            }

        };

    }
]);