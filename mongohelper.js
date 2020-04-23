DBCollection.prototype.fields = function fields(rowdepth) {
    var fields = {};
    if(rowdepth === true)
        rowdepth = this.count();
    if (typeof rowdepth == 'undefined') 
        depth = 101 * 100;
    this.find().limit(rowdepth).sort({
        _id: -1
    }).forEach(function(x) {
        var rowfields = dotNotateFields(x);
        for (var i in rowfields) {
            fields[i] = rowfields[i];
        }
    })
    var ret = [];
    for(var i in fields){
        ret.push(i);
    }
    return ret;

    function dotNotateFields(obj, prefix) {
        var fields = {};
        if (!prefix) prefix = "";
        for (var j in obj) {
            if (isNaN(parseInt(j))) fields[prefix + j] = 1;
            var x = Object.prototype.toString.call(obj[j]);
            if ((x.match(/bson_object/) || x.match(/Array/) || x.match(/object Object/)) && !x.match(/ObjectId/)) {
                var px = isNaN(parseInt(j)) ? j + '.' : '';
                var fieldsdot = dotNotateFields(obj[j], px);
                for (var i in fieldsdot) {
                    fields[prefix + i] = 1;
                }
            }
        }
        return fields;
    }
}

//requires DBCollection.prototype.fields
DB.prototype.grep = function(search, includeNonIndexedFields) {
    var collections = this.getCollectionNames();
    var ret = [];
    if(!includeNonIndexedFields)
        includeNonIndexedFields = false;
    for (var i = 0; i < collections.length; i++) {
        var col = collections[i];
        var indexes = this.getCollection(col).getIndexKeys();
        var findFields = {};
        if (includeNonIndexedFields) {
            var findFieldsArray = this.getCollection(col).fields();
            for(var c =0;c<findFieldsArray.length;c++){
                findFields[findFieldsArray[c]] = 1; 
            }
        } else {
            for (var j = 0; j < indexes.length; j++) {
                for (var field in indexes[j]) {
                    findFields[field] = 1;
                    break;
                }
            }
        }
        for (var field in findFields) {
            var farr = {};
            farr[field] = search;
            if (this.getCollection(col).findOne(farr)) {
                print(tojson(search) + " exists in " + this + "." + col + "." + field);
                ret.push({
                    collection: col,
                    field: field
                });
            }
        }
    }
    return {
        search: search,
        includeNonIndexedFields: includeNonIndexedFields, 
        results: ret
    };
}
