CSVWriter.js
Functions for converting JSON to CSV. 
Most of the functions are self explanatory. 
At the top of the file you will find an example that uses these together for the full process.

Functions:
ConvertToCSV - utilizies addtional functions - toCSVString & PropsMissingAndOrWrongOrder
writeCSV
getCSVstring_PropNamesAsHeaders
removeDelimiterfromProps
regexReplaceinProps
JSON.flatten - Found this on SO, needed it for my use case 

Notes:
Currently Adding support for non-uniform object arrays.
 
----------------------------

CSVCompletionRates.js
Gets CSV completion rates 
Assumes the objects are uniform (all the same properties) 