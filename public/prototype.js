'use strict';

Array.prototype.moveTop = function(value, by) {
    var index = this.indexOf(value);
    
    if(index === -1) 
        throw new Error("Element not found in array");
        
    this.splice(index,1);
    this.splice(0,0,value);
};

Array.prototype.getbyId = function(value, by) {
	for (var i = 0; i < this.length; i++) {
		if (this[i]._id == value)
			return this[i];
	};
	throw new Error("Element not found in array");
};