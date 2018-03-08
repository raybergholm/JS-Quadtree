/*
	A Quadtree is a tree structure that can be used to represent a 2D plane. It is especially handy for speeding up collision detection since each Quadtree node by definition occupies a discrete area which is mutually exclusive with sibling nodes, so they don't need to be checked for collisions.
	
	A Quadtree node contains items, which are appended to the node until it reaches the defined maximum. When it hits the maximum, it creates child nodes which corresponds to four quadrants smaller quadrants inside the node. Any object lying entirely within a child node's bounds is reassigned to that node, otherwise if the bounds straddles multiple child nodes, it remains in the parent node.
	
	All items require an abstract boundary property with the following profile:
		bounds: {
			id: id, 		// reference to the corresponding parent object
			x: x,			// left boundary
			y: y,			// top boundary
			width: width,	// right boundary = x + width
			height: height	// bottom boundary = y + height
		}
	The x, y, width and height properties describe the rectangular space occupied by the object. This rectangular representation is fine even if the object is some other shape: the point of the Quadtree is to split objects into separate nodes where objects in entirely different nodes occupy a mutually exclusive space. This lowers the number of comparisions required when checking the actual collision detection.

	
	@params:
		bounds is the 2D rectangular area represented by the node.
		parent is the reference to the parent node.
		id identifies the node relative to its parent (combination of ROOT, NE, SE, SW and NW).
	
	
	Example use:
		var quadtree = new Quadtree({
			x: 		// top bound
			y: 		// left bound
			width: 	// x + width = right bound
			height: // y + height = bottom bound
		}, level); 	// level is optional, set this to a value <= _MAX_LEVELS to preallocate nodes	
		
		// parent and id only relevant for child nodes. Leave these empty when instantiating the root node
		
	Example with a canvas:
		var quadtree = new Quadtree({
			x: 0,
			y: 0,
			width: canvas.width
			height: canvas.height
		});
*/
function Quadtree(bounds, parent, id){
	this._MAX_ITEMS = 5;	// change this to allow more items in the parent node before assigning child nodes
	this._MAX_LEVELS = 5;	// change this to control the Quadtree depth. Deeper = more granularity
	this._MAX_NODES = 4;	// Quadtrees have 4 child nodes. Changing this would change the tree type
	
	this.items = [];
	this.bounds = bounds;
	this.nodes = null;
	this.parent = parent || null; // root node has null ref, child nodes point to their parent
	
	this.level = parent ? parent.level + 1 : 1;
	
	this.emptyChildren = 0;
	
	this.nodeId = parent ? parent.nodeId + "-" + id : "ROOT";
	
	/*
		Clears the current and child nodes. This recursively walks down to the child nodes and clears from the bottom-left to the right and up. All objects and child nodes are detached.
		
		@params: N/A
		@return: returns itself for method chaining
	*/
	this.clear = function(){
		if(this.nodes){
			for(var i = this.nodes.length - 1; i >= 0; i--){
				this.nodes[i].clear();
				this.nodes.pop();
			}
			this.nodes = null;
		}

		while(this.items.length > 0){
			this.items.pop();
		}
		
		return this;
	};
	
	/*
		Clears the child nodes belonging to this parent node.
		
		@params: N/A
		@return: returns itself for method chaining
	*/
	this.clearChildren = function(){
		if(this.nodes){
			while(this.nodes.length > 0){
				this.nodes.pop();
			}
			this.nodes = null;
		}
		
		return this;
	};
	
	/*
		Recursively walks down to the lowest level of the Quadtree available for a best fit, then inserts the item to that node.
		
		@params: 
			item - the item to be added. It should have the bounds property describing the rectangular space it occupies to provide the best fit.
		@return: returns the affected node.
	*/
	this.insert = function(item){
		var index;
		if(this.nodes){
			index = this.getQuadrant(item.bounds);
			if(index !== -1){
				return this.nodes[index].insert(item); // recursively walks down levels
			}
		}

		this.items.push(item);
		
		if(this.items.length > this._MAX_ITEMS){
			this.delegate();
		}
		
		return this;
	};
	
	/*
		Searches the Quadtree for the given item. Recursively walks down to the approximate level where the item should be and searches the items on that node. If it was not found, it starts searching upwards until it finds it or it hits the root node, where it will return false.
		
		@params: 
			item - the item to be removed. It should have the bounds property describing the rectangular space it occupies to provide the best fit.
		@return: returns the removed item, or false if it was not found.
	*/
	this.remove = function(item){
		var index, item;
		if(this.nodes){
			index = this.getQuadrant(item.bounds);
			if(index !== -1){
				item = this.nodes[index].remove(item); // recursively walks down levels
				if(item){
					return item;
				}else{
					// item wasn't found in the child node, try finding it here
					index = this.items.indexOf(item);
					if(index !== -1){
						return this.items.splice(index, 1)[0];
					}else{
						return false;
					}
				}
			}
		}else{
			index = this.items.indexOf(item);
			if(index !== -1){
				return this.items.splice(index, 1)[0];
			}else{
				return false;
			}
		}
		
	};
	
	/*
		Searches the Quadtree for the given item from the top down. Not very optimised, but it is a through search. 
		
		@params: 
			item - the item to be removed. It should have the bounds property describing the rectangular space it occupies to provide the best fit.
		@return: returns the removed item, or false if it was not found.
	*/
	this.removeByBruteForce = function(item){
		var index;
		for(var i = 0; i < this.items.length; i++){
			index = this.items.indexOf(item);
			if(index !== -1){
				return this.items.splice(index, 1)[0];
			}
		}
		if(this.nodes){
			for(var i = 0; i < this.nodes.length; i++){
				this.nodes[i].removeByBruteForce(item);
			}
		}
	};
	
	
	/* 
		TODO: this should be the master method for up/down reallocation
		Down: if current node items.length > _MAX_ITEMS, delegate down into the appropriate sections by checking the bounding box
		Up: if the current item no longer fits this node's boundary, toss it upwards until it is caught by a valid parent
	*/
	this.update = function(){
		var index = -1;
		
		if(this.nodes){
			for(var i = 0; i < this.nodes.length; i++){
				this.nodes[i].update();
			}
		}
		
		for(var i = this.items.length - 1; i >= 0; i--){
			// Item out of bounds for this node? toss it upwards
			if(this.parent && !this.inBounds(this.items[i])){
				this.parent.items.push(this.items[i].splice(1,0)[0]); // we can skip the object's own insert procedure at this stage since the parent will validate its items after the children have thrown their invalid items upwards.
			}
			
			if(this.nodes){
				// Item can fit a child node? Insert it there
				index = this.getQuadrant(this.items[i].bounds);
				if(index !== -1){
					return this.nodes[index].insert(this.items.splice(i, 1)[0]);
				}
			}
		}
	}
	
	this.updateNode = function(){
		var index = -1;
		
		for(var i = this.items.length - 1; i >= 0; i--){
			if(this.parent && !this.inBounds(this.items[i])){
				this.parent.insert(this.items.splice(i, 1)[0]);
			}else if(this.nodes && (index = this.getQuadrant(this.items[i].bounds)) !== -1){
				this.nodes[index].insert(this.items.splice(i, 1)[0]);
			}
		}
		
		return this;
	}
	
	/*
		Retrieves every item which could be overlapping in the given area. This calls itself recursively until it reaches the deepest child node which corresponds to the given area, then collects all items it finds on the way up.
		
		@params: 
			target - a rectangular area.
		@return: an array of items within the area which can be checked for collisions.
	*/
	this.retrieve = function(target){
		var list = [], index;
		
		index = this.getQuadrant(target);
		if(index !== -1){
			list = list.concat(this.nodes[index].retrieve(target));
		}
		
		return list.concat(this.items);
	};
	
	/*
		Retrieves every item from the root node down to the current node.
		
		@params: N/A
		@return: an array of items which may be overlapping.
	*/
	this.retrieveItems = function(){
		var list = [], index;
		
		if(this.parent){
			list = list.concat(this.parent.retrieveItems());
		}
		
		return list.concat(this.items);
	}
	
	/*
		Retrieves every item stored in the Quadtree. Uses each() to perform tree traversal.
		
		@params: 
			order - an optional integer. Positive means post-order, negative means pre-order. If order is falsy, it is set to be post-order by default.
		@return: an array of items within the area which can be checked for collisions.
	*/
	this.retrieveAll = function(order){
		var list = [];
		
		this.each(null, function(node){
			list = list.concat(node.items);
		});
		
		return list;
	}
	
	/*
		Creates child Quadtree nodes with boundaries corresponding to four smaller quadrants inside the parent node's boundary. Note that the spatial ordering for child nodes is clockwise from north, that is the child nodes are arranged as:
		
			nodes[3]  |  nodes[0]
			----------|----------
			nodes[2]  |  nodes[1]
		
		@params: N/A.
		@return: returns itself for method chaining.
	*/
	this.split = function(){
		var horizontalMidpoint = (this.bounds.x + this.bounds.width) / 2,
			verticalMidpoint = (this.bounds.y + this.bounds.height) / 2,
			x = this.bounds.x,
			y = this.bounds.y;
		
		this.nodes = [];
		
		// Northeast quadrant
		this.nodes.push(new Quadtree({x: horizontalMidpoint, y: y, width: this.bounds.width / 2, height: this.bounds.height / 2}, this, "NE"));
		// Southeast quadrant
		this.nodes.push(new Quadtree({x: horizontalMidpoint, y: verticalMidpoint, width: this.bounds.width / 2, height: this.bounds.height / 2}, this, "SE"));
		// Southwest quadrant
		this.nodes.push(new Quadtree({x: x, y: verticalMidpoint, width: this.bounds.width / 2, height: this.bounds.height / 2}, this, "SW"));
		// Northwest quadrant
		this.nodes.push(new Quadtree({x: x, y: y, width: this.bounds.width / 2, height: this.bounds.height / 2}, this, "NW"));
		
		return this;
	}
	
	/*
		Delegates the current node's contents into child nodes. Anything which is wholly enclosed by a child node's boundary will be moved there, otherwise it remains in the current node.
		
		@params: N/A.
		@return: returns itself for method chaining.
	*/
	this.delegate = function(){
		var index;
		
		if(this.level <= this._MAX_LEVELS && !this.nodes){
			this.split();
		}
		
		for(var i = 0; i < this.items.length; i++){
			index = this.getQuadrant(this.items[i]);
			if(index !== -1){
				this.nodes[index].insert(this.items.splice(i,1)[0]);
			}
		}

		return this;
	};
	
	/*
		Reassign the given item to the parent node.
		
		@params: 
			item - an item inside the node's collection.
		@return: returns the target node (parent).
	*/
	this.reassign = function(item){
		var index = this.items.indexOf(item);
		if(index === -1){
			return false;
		}
		return this.parent.insert(this.items.splice(index, 1)[0]);
	}
	
	/*
		Reassign all items in this node to the parent node.
		
		@params: N/A
		@return: returns the target node (parent).
	*/
	this.reassignAll = function(){
		while(this.items.length > 0){
			this.parent.insert(this.items.pop());
		}
		return this.parent;
	}
	
	this.merge = function(){
		var itemCount = this.items.length;
		if(this.nodes){
			for(var i = 0; i < this._MAX_NODES; i++){
				itemCount = this.nodes[i].merge();
				
				if(itemCount < this._MAX_ITEMS){
					this.nodes[i].reassignAll();
				}
			}
		}
		return this.items.length;
	}
	
	/*
		Walks through the entire tree. For each node, if all child leaves are empty, they are pruned and the node becomes a leaf.
		
		@params: N/A
		@return: returns the number of items currently in the node (used by recursive calls).
	*/
	this.prune = function(){
		var itemCount = 0;
		if(this.nodes){
			// node, not leaf. Go deeper
			for(var i = 0; i < this._MAX_NODES; i++){
				itemCount += this.nodes[i].prune();
			}
			
			if(itemCount === 0){
				this.clearChildren();
			}
		}
		
		return this.items.length;
		
	};

	/*
		Determines the index of the child node which corresponds to the given object's boundary. If the boundary is wholly enclosed by a child node's boundary, it will return that node's index. Otherwise, it will return -1.
		
		@params: 
			target - rectangular description of the boundary.
		@return: returns the index of a child Quadtree node or -1 if no object fits.
	*/
	this.getQuadrant = function(target){
		var index = -1, verticalMidpoint, horizontalMidpoint, north, south, west, east;
		
		if(this.nodes){
			horizontalMidpoint = (this.bounds.x + this.bounds.width) / 2,
			verticalMidpoint = (this.bounds.y + this.bounds.height) / 2;
			
			north = target.y + target.height < verticalMidpoint;
			south = target.y > verticalMidpoint;
			west = target.x + target.width < horizontalMidpoint;
			east = target.x > horizontalMidpoint;
			
			if(north){
				// Object completely fits within the north quadrants 	
				if(west){
					index = 3; // Northwest
				}else if(east){
					index = 0; // Northeast
				}
			}else if(south){
				// Object completely fits within the south quadrants 	
				if(west){
					index = 2; // Southwest
				}else if(east){
					index = 1; // Southeast
				}
			}
		}
		
		return index;
	};
	
	/*
		Returns the bounds for each node in the Quadtree. Uses each() to perform tree traversal.
		
		@params: an optional integer. Positive means post-order, negative means pre-order. If order is falsy, it is set to be post-order by default.
		@return: an array of each node's bounds.
	*/
	this.getAllBounds = function(order){
		var list = [];
		
		this.each(null, function(node){
			list = list.concat(node.bounds);
		});
		
		return list;
	};
	
	/*
		Checks if the given bounds fits within the current node's bounds.
		
		@params: a bounds description.
		@return: a boolean representing if the bounds lies wholly inside the node's bounds.
	*/
	this.inBounds = function(itemBounds){
		return !(itemBounds.x < this.bounds.x ||
			itemBounds.x + itemBounds.width > this.bounds.x + this.bounds.width ||
			itemBounds.y < this.bounds.y ||
			itemBounds.y + itemBounds.height > this.bounds.y + this.bounds.height);
	};
	
	/*
		Generic depth-first tree traversal. This can be used to perform custom functionality on each node in sequence. The supported settings are pre-order (execute the callback function on the parent node before child node) or post-order (execute the callback function on child nodes first, then on the parent level).
		
		@params: 
			preOrderCallback - a function which is executed once per node, with the current node as its first parameter. Executes before tree traversal.
			postOrderCallback - a function which is executed once per node, with the current node as its first parameter. Executes after tree traversal.
		@return: returns itself for method chaining.
		@throws: if the function parameter is missing, it will throw an Error object.
	*/
	this.each = function(preOrderCallback, postOrderCallback){
		if(!preOrderCallback && !postOrderCallback){
			throw new Error("Error in method Quadtree.each: missing function parameter(s). Supply at least one callback function to execute.");
		}
		
		preOrderCallback && preOrderCallback(this);
		
		if(this.nodes){
			for(var i = 0; i < this._MAX_NODES; i++){
				this.nodes[i].each(preOrderCallback, postOrderCallback);
			}
		}
		
		postOrderCallback && postOrderCallback(this);
		
		return this;
	};
	
	/*
		Similar to each(), however this iterates through every leaf node (nodes with no child nodes) from left to right. On each leaf node, it will execute the callback function given as a function parameter. This method skips past upper nodes, however they can still be accessed from the leaf node's parent attribute.
		
		@params: 
			func - a function which is executed on every leaf node.
		@return: returns itself for method chaining.
		@throws: if the function parameter is missing, it will throw an Error object.
	*/
	this.eachLeaf = function(callback){
		if(!callback){
			throw new Error("Error in method Quadtree.eachLeaf: missing function parameter.");
		}
		
		if(this.nodes){
			for(var i = 0; i < this._MAX_NODES; i++){
				this.nodes[i].eachLeaf(callback);
			}
		}else{
			callback(this);
		}
		
		return this;
	};
	
	
	/*
		Method for identifying the current node as a leaf node. OO principle: black box use of the Quadtree should be available, so external use of this object should not need to know that this.nodes contains the references to child nodes.
		
		@params: N/A
		@return: a boolean value identifying if the current node is a leaf node (no children).
	*/
	this.isLeaf = function(){
		return !this.nodes;
	};
	
	this.serializeNodes = function(){
		var list = [];
		
		this.each(function(node){
			list.push(node);
		});
		
		return list;
	};
	
	this.describeTree = function(order){
		var list = [];
		
		this.each(null, function(node){
			list.push(node.nodeId);
		});
		
		return list;
	}
	
	
}