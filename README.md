# Council Voting Results

This repository contains a sample application that queries the dataset about "Council votes on legislative acts".

The datasets are available in [RDF Data Format](http://en.wikipedia.org/wiki/Resource_Description_Framework) in the form of [Linked Open Data](http://en.wikipedia.org/wiki/Linked_data) for download as zip file and for query using the [SPARQL](https://en.wikipedia.org/wiki/SPARQL) syntax.

More information on the dataset can be found on the [Open data Policy page](http://www.consilium.europa.eu/en/general-secretariat/corporate-policies/transparency/open-data/ "Open data") on [Council's website](http://www.consilium.europa.eu/).

You can run this sample query page at the url: http://eucouncil.github.io/CouncilVotesOnActsDatasetSample/

## Data Model

The data in the Votig Results dataset is modeled as "data cube", with all data de-normalized in an "observation". This approach has the advantage of making it easier to run aggregation and queries for analysis (for example, "count all acts where _CountryXYZ_ voted against"), but makes it a bit more complex to do standard searches (like, "give me all the information about vote number _12345_").

### Structure of an "observation"

An observation (basically what a country voted for with all the de-normalized data of an act) contains the following data:

 * ID (random number + country)
 * Act Type
 * configuration
 * policy area
 * country
 * voting procedure
 * voting rule
 * action by Council
 * council doc number
 * inter-institutional document number
 * session number
 * act number
 * act date
 * publication status
 * vote

## Sample SPARQL queries

For make it easier to understand how the data is modeled and how to query this "data cube", following are some sample queries. Queries can be tested directly against the datasets via the [interactive query page](http://data.consilium.europa.eu/sparql) provided on [Council's OpenData site](http://data.consilium.europa.eu/).

### Aggregation query

The following query counts how a country voted (how many times it voted in favour, against, abstained or didn't participate)

```
SELECT COUNT(?act) as ?count ?vote
from <http://data.consilium.europa.eu/id/dataset/votingresults>
where {
?observation
<http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/country>
<http://data.consilium.europa.eu/data/public_voting/consilium/country/uk>
.
?observation
<http://data.consilium.europa.eu/data/public_voting/qb/measureproperty/vote>
?vote
.
?observation
<http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/act>
?act
}
```

### Details of an act

The following query lists of the properties of an act, together with all the countries that voted and how they voted.

```
SELECT DISTINCT ?act ?id ?title ?actDate ?name ?propName ?vote
from <http://data.consilium.europa.eu/id/dataset/votingresults>
where {
?observation
<http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/act>
<http://data.consilium.europa.eu/data/public_voting/consilium/act/31342>
.
?observation
<http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/act>
?act
.
?act
skos:prefLabel
?id
.
?act
skos:definition
?title
.
?observation
?what
?value
.
?observation
<http://data.consilium.europa.eu/data/public_voting/qb/dimensionproperty/actdate>
?actDate
.
?observation
<http://data.consilium.europa.eu/data/public_voting/qb/measureproperty/vote>
?vote
.
?what a <http://purl.org/linked-data/cube#DimensionProperty>
.
?value
skos:prefLabel
?name
.
?what
<http://purl.org/dc/terms/title>
?propName
}
```

More sample queries can be found in the [SPARQL-queries.txt file](SPARQL-queries.txt).
