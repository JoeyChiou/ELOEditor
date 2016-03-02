/**
    Copyright 2016 edX PDR Lab, National Central University, Taiwan.
    
        http://edxpdrlab.ncu.cc/
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
    
    Created By: joeyc0916@gmail.com
    Maintained By: joeyc0916@gmail.com
*/

window.dash = window.dash || {};
var db = require('diskdb');

db = db.connect('collections', ['users', 'settings']);

dash.saveSetting = function(uid, settings) {
    // upsert
    var upd = db.settings.update({
        uid: uid
    }, {
        uid: uid,
        settings: settings
    }, {
        multi: false,
        upsert: true
    });

    if (upd.updated > 0 || upd.inserted > 0) {
    	localStorage.setItem('settings', JSON.stringify(settings));
        return 1;
    } else {
        return 0;
    }
};
