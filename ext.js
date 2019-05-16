/**
* if visitor saw the experiment before, in a different session, send "return visitor" event
* return visitor metric needs to be scoped to an experiment by using some unique string or ID
*/
setTimeout(function() {

  try {
    var forwardToPJS = {
      mode: extension.mode,
      return_visitor_evt_apiname: extension.return_visitor_evt_apiname,   
      experimentId: experimentId,
      campaignId: campaignId,
      variationId: variationId,
      isHoldback: isHoldback
    };
    window.__optReturnVisitorTracker.setParams(forwardToPJS);
    window.__optReturnVisitorTracker.decisionMade(experimentId);
  } catch(err) { console.log(err); }
  
}, 0);
