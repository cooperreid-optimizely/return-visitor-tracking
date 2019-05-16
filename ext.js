/**
* if visitor saw the experiment before, in a different session, send "return visitor" event
* return visitor metric needs to be scoped to an experiment by using some unique string or ID
*/
window.optimizely = window.optimizely || [];

/*
* Cookie Util
* https://github.com/litejs/browser-cookie-lite
* cookie(name, value, [ttl], [path], [domain], [secure])
*/
var cookieUtil=function(e,o,n,t,i,c){return arguments.length>1?document.cookie=e+"="+encodeURIComponent(o)+(n?"; expires="+new Date(+new Date+1e3*n).toUTCString():"")+(t?"; path="+t:"")+(i?"; domain="+i:"")+(c?"; secure":""):decodeURIComponent((("; "+document.cookie).split("; "+e+"=")[1]||"").split(";")[0])}
var experimentId = experimentId; // part of scope in custom extension code
var flagKey = 'saw_exp_' + experimentId;
var currentSessionId = optimizely.get('session').sessionId;
var logger = (function() {
  if(extension.debug === 'on') return console;
  return {log: function() {}, group: function() {}, groupEnd: function() {}, groupCollapsed: function() {}, dir: function() {}};
})();

logger.log('opt: In the "Track Return Visitors" extension', extension);

// check visitor attributes to see if the visitor has seen the experiment in a different optimizely session
var sawExperimentPreviously = (function() {
  try {
    return optimizely.get('visitor').custom[flagKey].value;
  } catch(err) { return null; }
})() || null;
var sawInPreviousOptimizelySession = sawExperimentPreviously && (sawExperimentPreviously != currentSessionId);

// check experiment cookie to see if they've seen it before in this session
var sawExpCookie = cookieUtil(flagKey) || null;
var sawInPreviousBrowserSession = !sawExpCookie && sawExperimentPreviously;

switch(extension.mode) {
  case 'both':
    if(sawInPreviousOptimizelySession || sawInPreviousBrowserSession) {
      // track event
      logger.log('opt: fire event, return (optimizely OR browser session):', extension.return_visitor_evt_apiname);
    } 
    break;
  case 'browser':
    if(sawInPreviousBrowserSession) {
      // track event
      logger.log('opt: fire event, return visitor (browser session):', extension.return_visitor_evt_apiname);
    } 
    break;
  case 'optimizely':
    if(sawInPreviousOptimizelySession) {
      // track event
      logger.log('opt: fire event, return visitor (optimizely session):', extension.return_visitor_evt_apiname);
    } 
    break;
   
}

// set localStorageFlag
var sawExpInSession = {};
sawExpInSession[flagKey] = currentSessionId;
optimizely.push({
  "type": "user",
  "attributes": sawExpInSession
});

// set session cookie flag
cookieUtil(flagKey, currentSessionId, 0, '/');
