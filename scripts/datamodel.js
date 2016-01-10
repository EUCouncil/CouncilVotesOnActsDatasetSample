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
