Helper functions for the mongodb shell

1. db.grep()
-Search through all fields in all collections in a database for a value. By default it searches only indexed fields. To include non-indexed fields, specify the second parameter as true.

2. db.collection.fields()
-list all keys in a collection
-by default, it only checks 10100 documents to get an exhaustive list, if you document varies across the collection, do: db.collection.fields(true)


To use, simply copy and paste the contents of mongohelper.js into your mongo shell.
or run
 load("/path/to/mongohelper.js");
