'use strict';

// service to dynamically add schema scripts to elements
angular.module('MarriottBreaks').factory('schemaService', [
    '$http',
    '$document',
    function ($http, $document) {

        function createSchemaScriptElement(){
            // find the body element
            var body = $document.find('body');

            // build the <script> element, set the type, and append to the body
            var schemaScriptElement = angular.element('<script></script>');
            schemaScriptElement.attr('type', 'application/ld+json');
            body.append(schemaScriptElement);

            return schemaScriptElement;
        }

        function injectSchemaData(schemaData){
            // create the script tag and inject the schema data
            var schemaScriptElement = createSchemaScriptElement();
            schemaScriptElement.html(JSON.stringify(schemaData, null, 2));
        }

        return {

            // retrieves the schema data from the server and injects it into a script tag
            getAndInjectSchemaData: function () {
                $http.get('/schema').then(function(response){
                    injectSchemaData(response.data);
                });
            }

        };

    }
]);