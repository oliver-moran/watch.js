/*
    The MIT License (MIT)

    Copyright (c) 2014 Oliver Moran

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
    of the Software, and to permit persons to whom the Software is furnished to do
    so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

(function () {
    "use strict";
    
    // an array to hold the Objects being watched, their clones and the callbacks
    var _observees = [];
    
    // the rate at which to check for changes to objects
    var _rate = 1e3/12;
    
    // kick-off the _compareObservees loop
    _compareObservees();
    
    /**
     * Extends the Object prototype with a watch method.
     * @param callback a Function to call when the Object changes
     */
    Object.prototype.watch = function (callback) {
        if (typeof callback != "function") {
            throw new Error("The Object.watch() method expects a single argument that is a Function.");
        }
        this.unwatch(); // only one watch at a time
        _observees.push({
            original: this,
            clone: this.clone(),
            callback: callback
        });
    };
    
    /**
     * Extends the Object prototype with an unwatch method.
     * Stops watching for changes to an objects.
     */
    Object.prototype.unwatch = function () {
        var _that = this;
        _observees.forEach(function (observee, i, observees) {
            if (observee.original === _that) {
                observees.splice(i, 1);
            }
        });
    }

    // Loops over the list of observees and compares the
    // observed objects to their clone. If there is a difference
    // then the callback is called.
    function _compareObservees() {
        //console.time("_compareObservees");
        _observees.forEach(function (observee, i, observees) {
            if (!observee.original.isIdenticalTo(observee.clone)) {
                observee.clone = observee.original.clone();
                observee.callback.call(observee.original);
            }
        });
        //console.timeEnd("_compareObservees");
        setTimeout(_compareObservees, _rate);
    }
    
    /**
     * Extends the Object prototype with a method that allows an object
     * to be cloned.
     * @returns a clone of the Object
     */
    Object.prototype.clone = function () {
        var clone = {};
        var props = Object.getOwnPropertyNames(this);
        for (var i = 0; i < props.length; i++) {
            if (!this.hasOwnProperty(props[i])) continue;
            if (this[props[i]] instanceof Object) {
                clone[props[i]] = this[props[i]].clone();
            } else {
                clone[props[i]] = this[props[i]];
            }
        }
        return clone;
    }
    
    /**
     * Extends the Object prototype with a method to deep compare
     * an Object with this Object
     * @param obj an Object to compare to this Object
     * @returns a Boolean true if the objects are identical,
     *          otherwise false
     */
    Object.prototype.isIdenticalTo = function (obj) {
        // combine the props of both obj1 and obj2
        var props = Object.getOwnPropertyNames(this);
        props = props.concat(Object.getOwnPropertyNames(obj));
        props = props.filter(function(elem, pos) {
            // filter out identical properties
            return props.indexOf(elem) == pos;
        });
        
        // loop over the compined properties and recursively check for differeences
        for (var i = 0; i < props.length; i++) {
            if (this[props[i]] instanceof Object && obj[props[i]] instanceof Object) {
                var identical = this[props[i]].isIdenticalTo(obj[props[i]]);
                if (!identical) return false;
            } else {
                var identical = (this[props[i]] == obj[props[i]]);
                if (!identical) return false;
            }
        }
        
        // no differences found
        return true;
    }
    
    function _isXor() {
    }
    
})();