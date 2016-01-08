function Act(id,title,date){
  var self = this;
  self.Id=id;
  self.Title=title;
  self.Date=date;
  self.Votes = [];

  this.Add = function (property, value, vote){
    if(property=="country")
    {
      self.Votes.push(new Vote(value,vote));
    }
    else
      self[property]=value;
  };
}

function Vote(country, vote) {
  this.Country = country;
  this.Vote = vote;
}
