watch.js
========

Extends the JavaScript Object prototype to observe when an object is changed.

Usage is as follows:

    var obj = {};
    
    obj.watch(function(){
      // will be called when the object is modified
    });
    
    obj.unwatch(); // will stop watching for changes

In addition, two helper methods are added to the Object prototype: `clone` and `isIdenticalTo`.

Usage of these is as follows:

    var obj1 = { alpha: "alpha", beta: "beta" };
    var obj2 = obj1.clone(); // creates a clone of obj1
    
    console.log( obj1 == obj2 ); // false because they are not the same object
    
    console.log( obj1.isIdenticalTo(obj2) ); // true because they are identical
    
Have fun!
