'use strict';
const fs = require('fs');
const knex = require('knex')({
    client: 'oracle',
    wrapIdentifier: function (value) {
        return (value !== '*' ? '' + value.replace(/"/g, '') + '' : '*')
    }
});


function replaceColumNames(string) {

    return string.replace(/\bUID\b/g, 'unique_id')
        .replace(/\bowner\b/g, 'report_owner')
        .replace(/\bdate\b/g, 'address_date')
        .replace(/\btype\b/g, 'report_type')
        .replace(/\btime\b/g, 'address_time')
        .replace(/''/g, 'NULL');

}

class Formatting {

    constructor(rawJSON) {
        this.rawJSON = rawJSON;
    }

    jsonToSQL() {

        var insertStatements = new Array();
        let incidents = JSON.parse(this.rawJSON);

        Object.keys(incidents).forEach(function (i) {
            var incidentId = i;
            var incident = incidents[i];
            var accidents = incident["main_data"];
            for (var j = 0; j < accidents.length; j++) {
                var obj = accidents[j];
                var sql = knex('mvar_json').insert(obj).toString();
                insertStatements.push(replaceColumNames(sql));
            }
        });
        return insertStatements;
    }
}
module.exports = Formatting;
