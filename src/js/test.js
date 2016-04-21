'use strict';
let a = function(cb){
    return cb(4);
};
a((data)=>{
    console.log('====>',data);
});