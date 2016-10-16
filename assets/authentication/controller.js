/**
 * Created by Albert on 10/15/2016.
 */
var username = 'anicolas@hawk.iit.edu';
var password = 'Anicolas1';
for(var i=1; i<=3; i++) {
    alert("Rabbit "+i+" out of the hat!")
}

var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

// auth is: 'Basic VGVzdDoxMjM='

var header = {'Host': 'https://tadhack.restcomm.com:443/restcomm-rvd/services/apps/AP6c74650b230b4018893c8f61d2d441a6/start?from=anicolas', 'Authorization': auth};
var request = client.request('GET', '/', header);
