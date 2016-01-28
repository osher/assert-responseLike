/**
usage : 

    var assert = require("assert");
    require("assert-response"); 

    test( "foo", function() {
      request(url, function(response){
          assert.responseLike( response
           , { status  : 200                      //throws 'Invalid response code - expected ... got ...'
             , headers :                      
               { "Content-Type" : "text/plain"    //throws 'response-header - expected ... got ...' 
               }
             , body    : "run vows for full spec" //throws 'Invalid response body - expected ... got ...'
             }
          );
      });
    });

 */

var assert = require('assert')
  , util   = require('util')
  ;
assert_response.colorize = colorize;
assert_response.colorize.colors = { bold: 1, red: 31, green: 32, yellow: 33 };
assert.responseLike = module.export = assert_response;

function assert_response(response, res, msg) { 
    var eql, status = (res.status || res.statusCode) * 1;
    if (!msg) msg = '';

    // Assert response status
    if (!isNaN(status)) { 
        eql = response.statusCode * 1 == status;
        assert.equal( response.statusCode * 1
        , status
        , msg + colorize('Invalid response status code.\n'
                + '    Expected: [green]{' + status + '}'
                + (eql ? '' : '\n    Got     : [red]{' + response.statusCode + '}')
                )
        );
    }

    // Assert response headers
    if (res.headers) {
        var keys = Object.keys(res.headers);
        for (var i = 0, len = keys.length; i < len; ++i) {
            var name     = keys[i]
              , actual   = response.headers[name.toLowerCase()]
              , expected = res.headers[name]
              ;
            eql = 
              expected instanceof RegExp
              ? expected.test(actual)
              : expected == actual
              ;
            assert.ok( eql
            , msg + colorize('response header '
                    + ' -  [bold]{' + name + '}\t- [bold]{' + expected + '}'
                    + (eql ? '' : '\n\t\t\t\t\t actual - [red]{' + actual + '}')
                    )
            );
        }
    }

    // Assert response body
    if (res.body !== undefined) { 
        checkBody(response, res.body, msg);
    }
    
    if (Array.isArray(res.bodyChecks)) {
        res.bodyChecks.some(function(expect) { 
            eql = checkBody(response, expect, msg);
            return !eql;
        })
    }
}

function checkBody(response, expect, msg) {
    var eql = false;
    if (expect instanceof RegExp)
        eql = expect.test(response.body);
    else if ('object' == typeof expect) 
        try{
            assert.deepEqual( 
              typeof response.body == 'string' 
              ? JSON.parse(response.body) 
              : response.body
            , expect
            );
            eql = true;
        }catch (ex){ 
            eql = false;
        }
    else 
        eql = expect == response.body;

    assert.ok( eql
    , msg + colorize('Invalid response body.\n'
          + '    Expected: [green]{' + util.inspect(expect) + '}\n'
          + (eql ? '' : '\n\t\t\t\t\t actual - [red]{' + util.inspect(response.body) + '}'))
    );  
  
    return eql
}


function colorize(str) {
    return str.replace(/\[(\w+)\]\{([^]*?)\}/g
      , function(_, color, str) {
            return '\x1B[' + colorize.colors[color] + 'm' + str + '\x1B[0m';
        }
    );
}
