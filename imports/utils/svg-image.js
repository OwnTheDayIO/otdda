// Meteor Components
import { _ } from 'lodash';

// App Components
import { log } from '/imports/utils/logging';

export const SvgImage = {

    svgDep: {},
    svgPromise: {},
    svgCache: {},

    getSvg(filepath, classname) {
        const depId = CryptoJS.MD5(`${filepath}_${classname}`).toString();

        // Register Dependency on SVG
        if (!this.svgDep[filepath]) {
            this.svgDep[filepath] = [];
        }
        if (_.isEmpty(this.svgDep[filepath]) || _.isUndefined(this.svgDep[filepath][depId])) {
            const dep = {[depId]: new Tracker.Dependency};
            this.svgDep[filepath].push(dep);
            dep[depId].depend();
        }

        // If SVG Request has been received, output SVG
        if (this.svgCache[filepath]) {
            return $(this.svgCache[filepath]).attr('class', classname).get(0).outerHTML;
        }

        // Request SVG over XHR
        if (_.isUndefined(this.svgPromise[filepath])) {
            this.svgPromise[filepath] = $.get(filepath);

            // Wait for SVG Request, update SVG cache when received
            this.svgPromise[filepath].then(data => {
                this.updateSvgCache(data, filepath);
            }, reason => log.error('SVG Request Failed!', reason));
        }

        // SVG not yet received, return nothing for now
        return '';
    },

    updateSvgCache(data, filepath) {
        // Get SVG Data
        const $svg = $(data).find('svg');
        if (!$svg.length) { return; }

        // Store SVG data in Cache
        this.svgCache[filepath] = $svg.get(0).outerHTML;

        // Trigger All Dependencies on this SVG to re-run
        if (this.svgDep[filepath] && this.svgDep[filepath].length) {
            _.each(this.svgDep[filepath], fileDeps => {
                _.each(fileDeps, (dep, depId) => {
                    dep.changed();
                });
            });
        }
    }
};
