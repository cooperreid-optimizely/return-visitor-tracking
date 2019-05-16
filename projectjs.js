window.optimizely = window.optimizely || [];
window.__optReturnVisitorTracker = (function() {

    /**
    * if visitor saw the experiment before, in a different session, send "return visitor" event
    * return visitor metric needs to be scoped to an experiment by using some unique string or ID
    * the event will fire once per new session (either opt or browser session)
    */

    /*
    * Cookie Util
    * https://github.com/litejs/browser-cookie-lite
    * cookie(name, value, [ttl], [path], [domain], [secure])
    */
    var cookieUtil=function(e,o,n,t,i,c){return arguments.length>1?document.cookie=e+"="+encodeURIComponent(o)+(n?"; expires="+new Date(+new Date+1e3*n).toUTCString():"")+(t?"; path="+t:"")+(i?"; domain="+i:"")+(c?"; secure":""):decodeURIComponent((("; "+document.cookie).split("; "+e+"=")[1]||"").split(";")[0])}
    var extKey = '__optReturnVisitorTracking';
    var currentSessionId;

    var logger = (function(debug) {
      if(debug) return console;
      return {log: function() {}, group: function() {}, groupEnd: function() {}, groupCollapsed: function() {}, dir: function() {}};
    })(!!localStorage.getItem('__optReturnVisitorTrackerDebug'));    
    
    var makeCookieKey = function(experimentId) {
        return 'saw_exp_' + experimentId;
    }

    var decisionMade = function(experimentId) {        
        
        logger.log('+++ Decision: Experiment:' + experimentId + ', SessionID: ' + currentSessionId);
        
        var extData = getParams(experimentId);
        extData.session = currentSessionId;
        setParams(extData);
        logger.log('+++ Set Optimizely Session flag', currentSessionId);

        // // set session cookie flag
        cookieUtil(makeCookieKey(experimentId), "saw", 0, '/');
        logger.log('+++ Set Cookie Session flag', makeCookieKey(experimentId), '=', currentSessionId);
    }

    var checkTrackableExperiments = function(experimentId) {
        /**
        * check localstorage data to see if the visitor has seen the experiment in a different optimizely session        
        */
        var extData = getParams(experimentId) || {};
        var sawExperimentPreviously = extData.session;
        var sawInPreviousOptimizelySession = sawExperimentPreviously && (sawExperimentPreviously != currentSessionId);
        logger.log('+++ sawInPreviousOptimizelySession', sawInPreviousOptimizelySession);        
        
        /**
        * Check experiment cookie to see if they've seen it before in this session
        */
        var sawExpCookie = cookieUtil(makeCookieKey(experimentId)) || null;
        var sawInPreviousBrowserSession = !!(!sawExpCookie && sawExperimentPreviously);              
        logger.log('+++ sawInPreviousBrowserSession', sawInPreviousBrowserSession);
        /**
        * Set the cookie flag again so we don't keep re-firing event on subsequent refreshes of the page
        * This essentially is a 'fire once' per session behavior
        */
        if(sawInPreviousBrowserSession) cookieUtil(makeCookieKey(experimentId), "saw", 0, '/');

        switch(extData.mode) {
          case 'both':
            if(sawInPreviousOptimizelySession || sawInPreviousBrowserSession) {
              // track event
              window.optimizely.push({type: "event", eventName: extData.return_visitor_evt_apiname});
              logger.log('+++ fire event, return (optimizely OR browser session):', extData.return_visitor_evt_apiname);
            } 
            break;
          case 'browser':
            if(sawInPreviousBrowserSession) {
              // track event
              window.optimizely.push({type: "event", eventName: extData.return_visitor_evt_apiname});
              logger.log('+++ fire event, return visitor (browser session):', extData.return_visitor_evt_apiname);
            } 
            break;
          case 'optimizely':
            if(sawInPreviousOptimizelySession) {
              // track event
              window.optimizely.push({type: "event", eventName: extData.return_visitor_evt_apiname});
              logger.log('+++ fire event, return visitor (optimizely session):', extData.return_visitor_evt_apiname);
            } 
            break;           
        }
    }    

    var setParams = function(paramsFromExtension) {
        var allExtData = JSON.parse(localStorage.getItem(extKey)) || {};
        allExtData[paramsFromExtension.experimentId] = paramsFromExtension;
        localStorage.setItem(extKey, JSON.stringify(allExtData));        
    }

    var getParams = function(expId) {
        try {
            return JSON.parse(localStorage.getItem(extKey))[expId+''];
        } catch(err) { return {}; }
    }
    
    window.optimizely.push({
      type: "addListener",
      filter: {
        "type": "lifecycle",
        "name": "activated" // session id ready at this point
      },
      handler: function(event) {
        /****** BEGIN INIT ROUTINE ******/    
        currentSessionId = optimizely.get('session').sessionId;
        logger.log('+++ INIT v0.3 +++', currentSessionId, (new Date).getTime());                   

        // make sure base LS entry exists
        if(!localStorage.getItem(extKey)) localStorage.setItem(extKey, '{}');

        // loop over all experiments in LS and fire a return visit if necessary
        var trackableExperimentsData = JSON.parse(localStorage.getItem(extKey)) || {};
        for(var expId in trackableExperimentsData) {
          checkTrackableExperiments(expId);
        }                  
        API.initialized = true;
        /****** END INIT ROUTINE ******/
      }
    });        

    var API = {
        initialized: false,
        getParams, getParams,
        setParams: setParams,
        decisionMade: decisionMade
    }
    
    return API;
    
})();
