/* This script converts user likes from
 * string to array format.
 */

var PORT = 3001;
var DB_NAME = "meteor";
var COLLECTION_NAME = "people-master";
var TAG = "SCRIPT";

function getList(listString) {
	return listString.split(/,\s?/);
}

function customLog(toPrint) {
	print("[" + TAG + "] " + toPrint);
}

var mongoConn = new Mongo("localhost:" + PORT);
customLog("mongo connection " + mongoConn);

var collection = mongoConn.getDB(DB_NAME).getCollection(COLLECTION_NAME);
customLog("collection " + collection);

var cursor = collection.find();
customLog("number of matching records: " + cursor.count());

while (cursor.hasNext()) {
	var item = cursor.next();
	customLog("person's name: " + item["name"]);
	var likesList = getList(item.likes);
	for (var i = 0; i < likesList.length; i++) {
		customLog(item["name"] + " likes " + likesList[i]);
	}
	collection.update(
		{ _id: item["_id"] },
		{ 
			$set: { likes: likesList }
		}
	);
}
