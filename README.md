# Skill-Sharing-Website
Chapt 21 from Eloquent JavaScript

### **GET** request to `"/talks"` returns JSON like:
```
[{"title": "Unituning",
  "presenter": "Jamal",
  "summary": "Modifying your cycle for extra style",
  "comments": []}]}
```

### Creating new talks done by making **PUT** requests to `"/talks/talk-title"`
- PUT req body should contain JSON obj with `presenter` and `summary` properties.

### Use `encodeURIComponent` to build up a URL
- Because talk titles may contain spaces and other chars that don't normally appear in a URL.
- Ex: 
```
console.log('/talks/' + encodeURIComponent('How to Idle'));
// → /talks/How%20to%20Idle
```

#### A request to talk about Idling might look like:
```
PUT /talks/How%20to%20Idle HTTP/1.1
Content-Type: application/json
Content-Length: 92

{"presenter": "Maureen",
 "summary": "Standing still on a unicycle"}
 ```

 ### Also support `GET` and `DELETE` to retrieve JSON and delete talks
 ### Adding a comment is done with `POST` to URL like `"/talks/talk-title/comments"`
 - JSON body has `author` and `message` properties
 ```
POST /talks/Unituning/comments HTTP/1.1
Content-Type: application/json
Content-Length: 72

{"author": "Iman",
 "message": "Will you talk about raising a cycle?"}
 ```

 ### Long Poling
 `GET` req may include extra headers to inform server to delay response.
 Use `ETag` and `If-None-Match` headers usually for managing caching.

 #### `ETag`: Server response header. 
 - Value is string that identifies current version of the resource.
 
 #### `If-None-Match` header: Client conditional header
 - Value is same as `ETag`'s

 #### How it works
 - If resource hasn't changed, server response is `304 "Not Modified"`.
 - This tells client the cached version is still current.
 - If tag does not match, server responds as normal.

 #### Our Server
 - Instead of immediately returning `304`, server will stall response.
 - Responds only when something changed, or given amount of time elapsed.
 - Long polling reqs will have header `Prefer: wait=90`. 
 - Tells server that the client will wait up to 90 seconds for response.

 *The server will keep a version # that it updates every time the takls change, and will use that as the ETag value.*

 Example Client Req:
 ```
GET /talks HTTP/1.1
If-None-Match: "4"
Prefer: wait=90

(time passes)

HTTP/1.1 200 OK
Content-Type: application/json
ETag: "5"
Content-Length: 295

[....]
 ```