angular.module('opendataApp', [])

  .factory('sparqlGenerator',function($http){
    return function(actId, policyArea){
      var assembledSparql = "SELECT DISTINCT ?act ?id ?title ?actDate ?name ?propName ?vote where {";
      //Add searchstrig for actId
      if(actId!=undefined && actId!="") assembledSparql+="?observation <http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/act> <http://data.consilium.europa.eu/data/public_voting/consilium/act/"+actId+"> . "

      if(policyArea!=undefined && policyArea!="") assembledSparql+="?observation <http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/policyarea> <http://data.consilium.europa.eu/data/public_voting/consilium/policyarea/"+policyArea+"> . "

      //Adds string for selecting act properties
      assembledSparql+="?observation "
        +"<http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/act> "
        +"?act "
        +". "
        +"?act "
        +"skos:prefLabel "
        +"?id "
        +". "
        +"?act "
        +"skos:definition "
        +"?title "
        +". "
        +"?observation "
        +"?what "
        +"?value "
        +". "
        +"?observation "
        +"<http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/actdate> "
        +"?actDate "
        +". "
        +"?observation "
        +"<http://data.consilium.europa.eu/data/public_voting/qb/measureproperty/vote> "
        +"?voteIRI "
        +". "
        +"?voteIRI "
        +"skos:prefLabel  "
        +"?vote "
        +". "
        +"?what a <http://purl.org/linked-data/cube%23DimensionProperty> "
        +". "
        +"?value "
        +"skos:prefLabel "
        +"?name "
        +". "
        +"?what "
        +"<http://purl.org/dc/terms/identifier> "
        +"?propName "
        +"}";
      return assembledSparql;
    };
  })
  .factory('sparqlQuery',function($http){
    return function(query){
      var baseAPI="http://data.consilium.europa.eu/sparql?";
      var requestUrl = baseAPI + "query="+query+"&format=application%2Fsparql-results%2Bjson";

      return $http.get(requestUrl)
      .then(function successCallback(response) {
        console.log(response.data.results.bindings);
        var acts = [];
        var bindings = response.data.results.bindings;
        for (var i = 0; i < bindings.length; i++) {
          var variable = bindings[i];

            var act = findAct(acts, variable.id.value);
            if(act==undefined){
              act = new Act(variable.id.value, variable.title.value, variable.actDate.value);
              acts.push(act);
            }
            act.Add(variable.propName.value,variable.name.value,variable.vote.value);
        }
        return acts;
        }, function errorCallback(response) {
        });
    };
  })

 .controller('actsController', ['sparqlGenerator','sparqlQuery',function(sparqlGenerator,sparqlQuery) {
   var vm = this;
   vm.performSearch = function() {
     vm.sparqlQuery = sparqlGenerator(vm.actNumber,vm.policyArea);
     sparqlQuery(vm.sparqlQuery).then(function (data){
       vm.acts = data;
       console.log(vm);
     });
   };

 }]);

 function findAct(array, id){
   for (var i = 0; i < array.length; i++) {
     if(array[i].Id==id)
     return array[i];
   }
   return undefined;
 }
