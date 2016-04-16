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

function Act(id,title,date){
  var self = this;
  self.Id=id;
  self.Title=title;
  self.Date=date;
  self.Votes=[];
  self.Votes["Yes"] = [];
  self.Votes["No"] = [];
  self.Votes["Abstain"] = [];
  self.Votes["DidNotParticipate"] = [];

  this.Add = function (property, value, vote){
    if(property=="country")
    {
      self.Votes[voteMaps[vote]].push(value);
    }
    else
      self[property]=value;
  };

  var voteMaps = {
    "Voted in favour":"Yes",
    "Voted against":"No",
    "Abstained":"Abstain",
    "Not participating":"DidNotParticipate"
  }
}
