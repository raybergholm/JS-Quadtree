# Quadtree
Basic Quadtree implementation in JavaScript

This thing is being rebuilt from the ground up, the old buggy barely-maintained code will eventually get tossed away.

__DONE:__
* node setup
* eslint rules
* new shiny ES6
* AABB implementation
* ... and tests
* Basic spatial partitioning for AABBs (axis-aligned splitting)
* ... and more tests

__TODO:__
* Sort out proper method + attribute assignments in constructors below
* Quadtree: 
* * grants public accessors for adding/removing items
* * wraps around the nodes and only needs a ref to the root node (e.g. all addItem calls get tossed to the root node and it will handle passing it down to the correct descendant)
* * uses config.json, modify that if Quadtree should change (or maybe just throw it in as a constructor param)
* Quadtree nodes 
* * ideally stays internal inside Quadtree, no need for external objects to directly access/mutate a node
* * items should be self-balancing: throwing in more items than the node limit should automatically make the node redistribute items up/down