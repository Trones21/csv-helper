## Website
CSV-Helper.com is the outgrowth out some CSV related functions I've had lying around. 

I recently needed to convert some JSON to CSV. I looked for sites, but my JSON was 400mb and this exceeded all limits for free conversion.

I had most of the required functions already written (because in the past I would just add the CSV conversion part directly to my web scraping scripts), so I started off using chrome snippets with a simple button that allowed me to upload my file and then run through the conversion functions. 
As I was adding capability (such as support for nested JSON), I realized other people could use this too, and it wouldn't be that difficult to create a simple little UI.  

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

## largeJSONGenerator
I use this to generate JSON, which I then use for testing my CSV to JSON converter on CSV-Helper.com