/*
---
script: ElementStacks.js
decription: ElementStacks stacks elements/images on top of each other with a funky transition
license: MIT-style license.
authors:
 - Oskar Krawczyk (http://nouincolor.com/)
requires: 
  core:1.2.3: 
  - Class.Extras
  - Array
  - Function
  - Event
  - Element.Style
  - Element.Dimensions
  - Fx.Morph
  - Fx.Transitions
provides: [ElementStacks]
...
*/

var ElementStacks = new Class({
    Implements: [Options],
    
    options: {
        rotationDeg: 20,
        delay: 40,
        duration: 900,
        transition: 'back:out'
    },
    
    initialize: function(selector, wrapper, options){
        this.setOptions(options);
        this.pos, this.collapsed, this.wrapper = wrapper, this.stackItems = selector
        
        this.setDefaults();
    },
    
    setDefaults: function(){
        this.stackItems.each(function(stackItem){
            this.pos = stackItem.getPosition(this.wrapper);

            stackItem.store('default:coords', this.pos);
        
            stackItem.set('styles', {
                top: this.pos.y,
                left: this.pos.x
            });
    
            stackItem.set('morph', {
                transition: this.options.transition,
                duration: this.options.duration
            });

            // MooTools bug (?)
            (function(){
                this.setStyle('position', 'absolute');
            }).delay(1, stackItem);
        }, this);
        
        this.attachActions();
    },
    
    reStack: function(els, mode, altEl){
        var that = this;
        els.each(function(stackItem, i){
            (function(){
                var el = $pick(altEl, this);
                var rand = (mode === 'in' ? $random(-that.options.rotationDeg, that.options.rotationDeg) : 0);
                
                this.set('styles', {
                    '-webkit-transform': 'rotate(' + rand + 'deg)',
                    '-moz-transform': 'rotate(' + rand + 'deg)'
                });
                
                this.morph({
                    top: el.retrieve('default:coords').y + rand,
                    left: el.retrieve('default:coords').x + rand
                });
                
                if (mode === 'in'){
                    el.setStyle('z-index', 100);
                } else {
                    (function(){
                        els.setStyle('z-index', 10);
                    }).delay(that.options.delay * (els.length * 2));
                }
            }).delay(that.options.delay * i, stackItem);
        });
    },

    attachActions: function(){
        
        this.stackItems.addEvents({
            click: function(e){

                if (this.collapsed){
                    this.reStack(this.stackItems);
                    this.collapsed = false;
                } else {
                    var target = $(e.target);

                    if (target.retrieve('default:coords')){
                       this.reStack(this.stackItems, 'in', target);
                       this.collapsed = true;
                    }
                }
            }.bind(this)
        });
    }
});