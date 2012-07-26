var vows  = require('vows')
  , claim = require('assert')
  ;
require("../")

function copy(s){ 
    var c = {}, p;
    for(p in s) c[p] = s[p];
    return c;
}


vows.describe(
  "assert response"
).addBatch(
  { "\u0000\nAPI" :
    { "assert should be decorated with the method: \n\n\tassert.responseLike ( oActualResponse, oExpectedDescr, sCustomMessage )":
      function(){   
          claim.isFunction(claim.responseLike);
          claim.lengthOf(claim.responseLike, 3);
      }
      
    }
  , "\u0000\ncheck":
    { topic: 
      { statusCode: 200
      , headers   : 
        { "content-type" : "text/html"
        , "cache-control": 'must-revalidate'
        , "x-powered-by" : "mock server"
        , date           : 'Thu, 26 Jul 2012 15:35:08 GMT'
        , uri            : 'http://127.0.0.1:5984/ua/aa'
        } 
      , body : "<h1>Some HTML</h1>of the body"
      }
    , "status code with attribute 'status'":
      { "providing correct numner should work":
        function(response){ 
            claim.responseLike(response, { status: 200 } );
        }
      , "providing wrong number should throw":
        function(response){ 
            claim.throws(function(){ 
                claim.responseLike(response, { status: 404 } );
            });
        }
      }
    , "status code with attribute 'statusCode'":
      { "providing correct number should work":
        function(response){ 
            claim.responseLike(response, { statusCode: 200 } );
        }
      , "providing wrong number should throw":
        function(response){ 
            claim.throws( function(){
                claim.responseLike(response, { statusCode: 301 } );
            });
        }
      }
    , "response headers" : 
      { "providing existing headers should work - case insensitive":
        function(response){
            claim.responseLike(response, 
              { headers: 
                { "Content-Type" : "text/html"
                , "X-Powered-By" : "mock server"
                }
              }
            );
        }
      , "providing wrong headers throw on the first mismatch":
        function(response){ 
            claim.throws(function(){
                claim.responseLike(response, 
                  { headers: 
                    { "Content-Type" : "text/xml"
                    , "X-Powered-By" : "real server"
                    }
                  }
                );
            });
        }
      , "providing missing headers throw on the first misfound":
        function(response){ 
            claim.throws(function(){
                claim.responseLike(response, 
                  { headers: 
                    { "Content-Type"  : "text/html"
                    , "no such header": ""
                    , "X-Powered-By"  : "real server"
                    }
                  }
                )
            });
        }
      , "- provide expected content":
        { "equal string - should pass":
          function(response){ 
              claim.responseLike( response, { headers: { "x-powered-by" : "mock server" } } );
          }
        , "different string - should throw":
          function(response){ 
              claim.throws(function(){
                  claim.responseLike( response, { headers: { "x-powered-by" : "mock serv" } } );
              });
          }
        , "matching regexp - should pass":
          function(response){ 
              claim.responseLike( response, { headers: { "x-powered-by" : /Mock/i } } );
          }
        , "non-matching regexp - should throw":
          function(response){ 
              claim.throws( function(){ 
                  claim.responseLike( response, { headers: { "x-powered-by" : /Mock/ } } );
              })
          }
        }
      }
    , "response body" : 
      { "regexp body descriptor that matches should not throw" :
        function(response){ 
            claim.responseLike(response, 
              { body: /Some HTML/
              }
            );
        }
      , "regexp body descriptor that does not match should throw" :
        function(response){ 
            claim.throws(function(){
                claim.responseLike(response, 
                  { body: /the secrets of the universe/
                  }
                );
            });
        }
      , "when descriptor is not a RegExp, and body is object - deep equal match should not throw":
        function(response){ 
            response = copy(response);
            response.body =                      { str: 'str', number: 1, arr: [1,"a",{a:1} ] };
            claim.responseLike(response, { body: { str: 'str', number: 1, arr: [1,"a",{a:1} ] } } );
        }
      , "when descriptor is not a RegExp, and body is object - deep equal difference should throw":
        function(response){ 
            claim.throws(function(){
                response = copy(response);
                response.body =                      {str : 'str', number: 1, arr: [1,3,{}] };
                claim.responseLike(response, { body: {str : 'str', number: 1, arr: [1,5,{}] } } );
            });
        }
      }
    }
  , "\u0000\nthrown errors - ":
    { "when providing a message" :
      { "should trail status-code error messages":
        function(){ 
            var message = "this is not the message you're looking for";
            try       { claim.responseLike( { statusCode: 200 }, { statusCode: 404 }, "Custom user message" );
            }catch(ex){ message = ex.message }

            claim.ok( message.indexOf('Custom user message') == 0, "'" + message + "' starts with 'Custom user message'");
        }
      , "should trail response-header error messages":
        function(){ 
            var message = "this is not the message you're looking for";
            try       { claim.responseLike( { headers: {x:"y"} }, { headers: {x:"Z"} }, "Custom user message" );
            }catch(ex){ message = ex.message }
            claim.ok( message.indexOf('Custom user message') == 0, "'" + message + "' starts with 'Custom user message'");
        }
      , "should trail response-body error messages":
        function(){ 
            var message = "this is not the message you're looking for";
            try       { claim.responseLike( { body: "x" }, { body: "y" }, "Custom user message" );
            }catch(ex){ message = ex.message }
            claim.ok( message.indexOf('Custom user message') == 0, "'" + message + "' starts with 'Custom user message'");
        }
      }
    , "a status-code check error message" :
      { topic: 
        function(response){ 
            var message = "this is not the message you're looking for";
            try{ 
                claim.responseLike( { statusCode: 200 }, { statusCode: 404 } );
            }catch(ex){ 
                message = ex.message;
            }
            return message;
        }
      , "should start with 'Invalid response status code'":
        function(message){ 
            claim.ok( message.indexOf('Invalid response status code') == 0, "'" + message + "' starts with 'Invalid response status code'");
        }
      , "should contain the expected response code":
        function(message){ 
            claim.ok( message.indexOf(200) != -1 , "contains 200");
        }
      , "should contain the actual response code":
        function(message){ 
            claim.ok( message.indexOf(200) != -1 , "contains 200");
        }
      }
    , "a missing response-header check error message" :
      { topic: 
        function(response){ 
            var message = "this is not the message you're looking for";
            try{ 
                claim.responseLike( { headers: {} }, { headers: { "no-such-header" : "some-obscure-header-value"} } );
                return false;
            }catch(ex){ 
                message = ex.message;
            }
            return message;
        }
      , "should start with 'response header'":
        function(message){ 
            claim.ok( message.indexOf('response header') == 0, "'" + message + "' starts with 'response header'");
        }
      , "should contain the expected response header name":
        function(message){ 
            claim.ok( message.indexOf('no-such-header') != -1 , "contains the saught header name");
        }
      , "should contain the expected response header value":
        function(message){ 
            claim.ok( message.indexOf('some-obscure-header-value') != -1 , "contains the saught header value");
        }
      , "should contain the actual response value":
        function(message){ 
            claim.ok( message.indexOf('undefined') != -1 , "contains undefined");
        }
      }
    , "a mismatching response-header check error message":
      { topic: 
        function(response){ 
            var message = "this is not the message you're looking for";
            try{ 
                claim.responseLike( { headers: {"my-header": "actual"} }, { headers: { "my-header" : "the@expected"} } );
                return false;
            }catch(ex){ 
                message = ex.message;
            }
            return message;
        }
      , "should start with 'response header'":
        function(message){ 
            claim.ok( message.indexOf('response header') == 0, "'" + message + "' starts with 'response header'");
        }
      , "should contain the expected response header name":
        function(message){ 
            claim.ok( message.indexOf('my-header') != -1 , "contains the saught header name");
        }
      , "should contain the expected response header value":
        function(message){ 
            claim.ok( message.indexOf('the@expected') != -1 , "contains the saught header value");
        }
      , "should contain the actual response value":
        function(message){ 
            claim.ok( message.indexOf('actual') != -1 , "contains actual value");
        }
      }
    }
  } 
).export(module);