/*
* Copyright 2016 Council of the European Union
*
* Licensed under the EUPL, Version 1.1 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
* You may not use this work except in compliance with the Licence.
* You may obtain a copy of the Licence at:
*
* https://joinup.ec.europa.eu/software/page/eupl
*
* Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the Licence for the specific language governing permissions and limitations under the Licence.
*/


angular.module('opendataApp', [])
  .factory('sparqlGenerator',function($http){
    return function(searchData){

      var assembledSparql = "SELECT DISTINCT ?act ?id ?title ?actDate ?name ?propName ?vote from <http://data.consilium.europa.eu/id/dataset/votingresults> where {";
      //Add searchstrig for actId
      if(searchData.docNumber!=undefined && searchData.docNumber!="") assembledSparql+="?observation <http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/docnrcouncil> <http://data.consilium.europa.eu/data/public_voting/consilium/docnrcouncil/"+searchData.docNumber+"> . "
      if(searchData.interNumber!=undefined && searchData.interNumber!="") assembledSparql+="?observation <http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/docnrinterinst> <http://data.consilium.europa.eu/data/public_voting/consilium/docnrinterinst/"+searchData.interNumber+"> . "
      if(searchData.title!=undefined && searchData.title!="") assembledSparql+="?act skos:definition ?title . FILTER REGEX (?title, \""+searchData.title+"\") . "

      if(searchData.date.from!=undefined && searchData.date.from!=""){
        var dateFrom=new Date(searchData.date.from);
        assembledSparql+="?observation <http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/actdate> ?actDate .FILTER (?actDate > \""+dateFrom.toISOString()+"\"^^xsd:dateTime) . ";
      }

      if(searchData.date.to!=undefined && searchData.date.to!=""){
        var dateTo=new Date(searchData.date.to);
        assembledSparql+="?observation <http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/actdate> ?actDate .FILTER (?actDate < \""+dateTo.toISOString()+"\"^^xsd:dateTime) . ";
      }

      if(searchData.policyArea!=undefined && searchData.policyArea!="") assembledSparql+="?observation <http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/policyarea> <http://data.consilium.europa.eu/data/public_voting/consilium/policyarea/"+searchData.policyArea+"> . "
      if(searchData.councilConfig!=undefined && searchData.councilConfig!="") assembledSparql+="?observation <http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/configuration> <http://data.consilium.europa.eu/data/public_voting/consilium/configuration/"+searchData.councilConfig+"> . "

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

   vm.searching=false;
   vm.noresults=false;

   vm.reset = function () {
     vm.searching=false;
     vm.noresults=false;
     vm.acts=[];
     vm.search=undefined;
   };

   vm.performSearch = function() {
     vm.searching=true;
     vm.noresults=false;
     vm.acts=[];
     vm.sparqlQuery = sparqlGenerator(vm.search);
     sparqlQuery(vm.sparqlQuery).then(function (data){
       vm.acts = data;
       vm.searching=false;
       if(vm.acts.length==0)
        vm.noresults=true;
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
