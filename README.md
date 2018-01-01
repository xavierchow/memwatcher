MemWatcher
================

Intro
---------------
A deadly simple wrapper of [node-memwatch](https://github.com/marcominetti/node-memwatch) to dump you heap when leaking occurs.

How to use
---------------
Just add the following snippet to your process,
by default the heap dump will be saved in the path like `/tmp/profile-{pid}-{timestamp}.heapsnapshot`.
```
const watcher = require('memwatcher')
watcher();

```

Licence
--------------
MIT
