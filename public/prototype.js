'use strict';

Array.prototype.moveTop = function(value, by) {
    var index = this.indexOf(value),
    
    if(index === -1) 
        throw new Error("Element not found in array");
        
    this.splice(index,1);
    this.splice(0,0,value);
};