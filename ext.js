window.optimizely = window.optimizely || [];
window.optimizely.push({
  type: "addListener",
  filter: {
    "type": "lifecycle",
    "name": "activated"
  },
  handler: function(event) {
    try {
      if(!!localStorage.getItem('__optReturnVisitorTrackerDebug')) {
        console.log('+++ In the Ext handler', (new Date).getTime());
      }
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

if(!!localStorage.getItem('__optReturnVisitorTrackerDebug')) {
  console.log('+++ In the Ext Body', (new Date).getTime());
}