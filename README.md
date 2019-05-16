# Track Return Visitors in Optimizely
Track visitors that return back to the site in a new session after being exposed to an experiment

![View](https://github.com/cooperreid-optimizely/return-visitor-tracking/blob/master/ext.png?raw=true)

## Installing 
* Copy the [`projectjs.min.js`](https://github.com/cooperreid-optimizely/return-visitor-tracking/blob/master/projectjs.min.js) content and add it to your Project Javascript
* Copy the [`ext.json`](https://github.com/cooperreid-optimizely/return-visitor-tracking/blob/master/ext.json) content and [create a new Custom Analytics Extension](https://help.optimizely.com/Integrate_Other_Platforms/Custom_analytics_integrations_in_Optimizely_X#Create_as_JSON)
* [Create a new Custom Event](https://help.optimizely.com/Build_Campaigns_and_Experiments/Custom_events_in_Optimizely_X#Create_a_new_custom_event) to track return visitors that is scoped to a specific experiment, _e.g._, "`return_visitor_EXPID`"
* Enable the tracking by visiting the Integrations tab on an experiment

## Settings
* _Return Visitor Event API Name_ - Set the `api_name` of your Custom Event. Each experiment using this extension should have a unique Event.
* _Session Mode_ - Set the boundaries of a session. Is a return visitor based on a browser's definition of a session or optimizely's

## Notes
* A [Browser Session](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Session_cookies) is defined by a user closing the browser. Extension sets a 'session cookie'
* An [Optimizely Session](https://help.optimizely.com/Analyze_Results/How_Optimizely_counts_conversions) is defined by a 30 minute period of inactivity.
