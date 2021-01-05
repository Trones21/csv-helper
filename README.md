## Website
CSV-Helper.com is the outgrowth out some CSV related functions I've had lying around. 

I recently needed to convert some JSON to CSV. I looked for sites, but my JSON was 400mb and this exceeded all limits for free conversion.

I had most of the required functions already written (because in the past I would just add the CSV conversion part directly to my web scraping scripts), so I started off using chrome snippets with a simple button that allowed me to upload my file and then run through the conversion functions. 
As I was adding capability (such as support for nested JSON), I realized other people could use this too, and it wouldn't be that difficult to create a simple little UI.  

## Examples

Examples. Each Example js file contain all the functions necessary for the example to work. Copy the entire file to a chrome snippet, make minor modifications such as output filename, delimiter, etc. and then run it.

## dataGenerator
I use this to generate or duplicate CSV or JSON, which I then use for various testing purposes. This is only partially written. I don't add functionality until I need it XD 


**Functions: List may not be updated**
If I ever decide to publish this more formally into an actual library, then I will sort through all the functions. Most work is currently focused on the website.

ConvertToCSV - utilizes additional function - toCSVString
determineMasterObject
getCSVstring_PropNamesAsHeaders
removeDelimiterfromProps
regexReplaceinProps
writeCSV
getCompletionRates
JSON.flatten - Found this on SO, needed it for my use case

Notes: You will need to run determineMasterObject and then getCSVstring_PropNamesAsHeaders in order to create the headers.

