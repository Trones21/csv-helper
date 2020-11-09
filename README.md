## CSVWriter.js

Functions for converting JSON to CSV. Most of the functions are self explanatory.
At the top of the file you will find an example that uses these together for the full process.

**Functions:**
ConvertToCSV - utilizes additional function - toCSVString
determineMasterObject
getCSVstring_PropNamesAsHeaders
removeDelimiterfromProps
regexReplaceinProps
writeCSV
JSON.flatten - Found this on SO, needed it for my use case

Notes: You will need to run determineMasterObject and then getCSVstring_PropNamesAsHeaders in order to create the headers.


## CSVCompletionRates.js

Gets CSV completion rates
Assumes the objects are uniform (all the same properties)