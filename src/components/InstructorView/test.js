
let topics = [{topic: 'alpha', id: 1}, {topic: 'middle', id: 2}, {topic: 'zenith', id: 4}];
topics.sort(function(a, b){
    //descending 
    let keyA = a.topic;
    let keyB = b.topic;
    // Compare the 2 dates
    if(keyA > keyB) return -1;
    if(keyA < keyB) return 1;
    return 0;
});

console.log(topics); 