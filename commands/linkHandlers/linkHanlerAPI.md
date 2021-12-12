#LinkHandler API Manual
This file contains the specification for how to create custom link handlers. 
  
Custom linkHandlers are `.js` files that are automatically loaded and indexed on startup. Each file contains functions that describe how to handle its links.
##Naming convention
The file must be names `${domainName}.js` where domain name is the base domain of the link you want to handle.   
**Example**: A handler for google.com would be named `google.js`
##Required parameters
* **linkHandler** *(url, (optional)customName)*   
`linkHandler` takes in a url and a custom name and returns a re-formatted link in the form: `{name: "string", url: "string"}`. It is the only required function for a linkHandler
## Optional parameters
Optional statements must be exported as null if not used. **Example** `export.saveAgent = null`
* **downloader** *(url)*  
`downloader` takes in a url and then downloads it and returns its raw data to be saved. This is mostly intended for special fetch/request functions where a basic get won't work. Note: if downloader is set, `linkHandler` *WILL* be run! You cannot have a single all-in-one downloader function that includes link re-formatting.
* **saveAgent** *(full-path, filename, data)*
`saveAgent` fully takes over the file-saving process. This is intended for situations where a single link may require multiple files or some more complicated writing is required. Similarly to `downloader` if `saveAgent` is specified, both `downloader` and `linkHandler` *WILL* be run first. This does give you more flexibility in the arguments as you could have `downloader` output some complex object in the `data` field since it is guaranteed that `saveAgent` will catch it.
