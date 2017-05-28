/*
 Copyright 2017 Michael Telatynski <7t3chguy@gmail.com>

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import MatrixClientPeg from './MatrixClientPeg';

function redact(str) {
    return str.replace(/#\/(room|user)\/(.+)/, "#/$1/<redacted>");
}

class Analytics {
    constructor() {
        this.tracker = null;
    }

    set(tracker) {
        this.tracker = tracker;

        this.tracker.enableHeartBeatTimer();
        this.tracker.enableLinkTracking(true);
    }

    async trackPageChange() {
        if (!this.tracker) return;
        this.tracker.setCustomUrl(redact(window.location.href));
        this.tracker.trackPageView();
    }

    async trackEvent(category, action, name) {
        if (!this.tracker) return;
        this.tracker.trackEvent(category, action, name);
    }

    async logout() {
        if (!this.tracker) return;
        this.tracker.deleteCookies();
    }

    async login() { // not used currently
        const cli = MatrixClientPeg.get();
        if (!this.tracker || !cli) return;

        this.tracker.setUserId(`@${cli.getUserIdLocalpart()}:${cli.getDomain()}`);
    }

}

if (!global.mxAnalytics) {
    global.mxAnalytics = new Analytics();
}
module.exports = global.mxAnalytics;