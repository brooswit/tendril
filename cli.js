var term = require( 'terminal-kit' ).terminal ;
var tendrilClient = require( './client' );

(async() => {
    while(true) {
        let list = await tendrilClient.list();
        term( 'Please enter which device you would like to issue a command to: ' );
        var username = await term.inputField({
            autoComplete: Object.keys(list),
            autoCompleteMenu: true
        }).promise;
        term.green( "\nYou entered '%s'\n" , username );

        let operations = list[username];
        term( 'Please enter which operation you would like to run: ' );
        var operationName = await term.inputField({
            autoComplete: operations,
            autoCompleteMenu: true
        }).promise;
        term.green( "\nYou entered '%s'\n" , operationName );

        
        term('executing remotely...\n');
        let result = await tendrilClient.execute(username, operationName);
        term('...executed remotely: ' + result + '\n');
    }
})();
