'use strict';

// service to dynamically add schema scripts to elements
angular.module('MarriottBreaks').factory('schemaService', [
    function () {

        return {

            appendSchemaToElement: function (element, schemaData) {
                // build the <script> element
                var script = angular.element('<script></script>');
                // convert the JSON data to string so it can be added to the script element
                var scriptData = JSON.stringify(schemaData, null, 2);

                // set the script info and append it to the element
                script.attr('type', 'application/ld+json');
                script.html(scriptData);

                element.append(script);
            },

            appendHotelItemSchema: function(hotelElement, hotelModel){
                var schemaData = {
                    "@context": "http://schema.org",
                    "@type": "Hotel",
                    "name" : hotelModel.HOTEL_NAME,
                    "image": hotelModel.IMAGE,
                    "priceRange": hotelModel.PRICE_RANGE,
                    "mainEntityOfPage": hotelModel.AVAILABILITY_URL,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": hotelModel.PROPERTY_CITY,
                        "addressRegion": hotelModel.PROPERTY_STATE,
                        "streetAddress": hotelModel.ADDRESS1,
                        "postalCode": hotelModel.ZIP
                    }
                };

                this.appendSchemaToElement(hotelElement, schemaData);
            }

        };

    }
]);