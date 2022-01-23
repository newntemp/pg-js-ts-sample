# Part One
## 1&2
The queries are in: `lib/data/queries/queries.ts`

## 3 - Adding Comments
Assuming the comments for all three domains are structured the same. We could add a comments table and a linking table.
The linking table would hold a reference to the comment entry and to the domain entry (report, document, page).

This would give us flexibility when iterating on the product, but will slow as the product scales. We'll probably also
want to implement some archival system to remove some combination of comments, reports, documents and pages from the
primary data tables to keep the product responsive.


The comments could also be added directly to the domain entry. There would then be a hard limit on how many comments
any given entry could have. To a user this limit would be inconsistent and arbitrary (because it's dependant on how
large other comments are) justifying it to them would be difficult.
We'd lose a lot of flexibility doing this but not needing additional joins would give us
some performance benefits. I'd assume we'll eventually want to expand the comment feature to include who wrote it
and other features, if that does happen we'd have to rework this implementation. This would be a bad design.


# Part Two
## 1&2
The code is in: `lib/ObjectStoreParser.js`

## 3 - Api Data

The original signature is: `search(value: string, store: IObjectStore): string[]`

If it's a static function:
`search(value: string, options?: GetOptions): Promise<string[]>`
Get options would not have the URL or method, I wouldn't expect the parent function to know that info.

Ideally the workflow doing the search doesn't know or care where the search data is coming from,
so the start of the search workflow would be:
`searchForSomething(value: string): Promise<SomeDataObj>`
which eventually makes a call to: `makeApiCall<T>(options: HttpOptions, body?: any) Promise<T>`
where `HttpOptions` has options to add headers, url, httpMethod type, ect. And `T` is the expected response object after extracting the response data.

If we need it to use callbacks the function might look something like:
`makeApiCall(successCallback:() => any, failureCallback: () => any, options: HttpOptions)`


Either way the request can be parsed for failure statuses and throw an error, that way error handling for
a bad request, response, server failure, timeout, etc. can be included in the parent's error handling.
The parent function can use a try catch if it's async/await, or .catch callback to receive the errors from the api call.
It could retry based on the type of error or inform the user of a problem.
