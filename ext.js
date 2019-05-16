window.optimizely = window.optimizely || [];
window.optimizely.push({
  type: "addListener",
  filter: {
    "type": "lifecycle",
    "name": "activated" // happens before init, act
  },
  handler: function(event) {
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
  }
});   
