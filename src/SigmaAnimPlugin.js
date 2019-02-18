const MC = require("@kissmybutton/motorcortex/");
window.sigma = require("sigma");
const SigmaAnimation = require("../lib/SigmaAnimationPlugin.js")

class SigmaAnimPlugin extends MC.TimedIncident {

    /**
     * Initialization of variables as soon as the context of the Incident
     * is defined (the Clip which is reffered to as BasePlugin that also holds
     * the sigma instance)
     */
    onGetContext() {
        this.finalG = this.attrs.animatedAttrs.finalG;
            this.SigmaAnimation = new SigmaAnimation(
            this.id,
            this.getInitialValue("finalG"),
            this.finalG,
            this.context.s,
            {
                x: "xFinal",
                y: "yFinal",
                size: "sizeFinal",
                color: "colorFinal"
            }
        );
        this.attrs.attrs.master.children.push(this);
    }

    /**
     * Secondary initialization when a change happens to the BasePlugin that 
     * needs to be reflected on the child animPlugins.
     */
    refreshInstance() {
        this.SigmaAnimation = new SigmaAnimation(
            this.id,
            this.getInitialValue("finalG"),
            this.finalG,
            this.context.s,
            {
                x: "xFinal",
                y: "yFinal",
                size: "sizeFinal",
                color: "colorFinal"
            }
        );
        return this;
    }

    /**
     * Override for get initial value when that function is FIRST called
     * within Motor Cortext core
     */
    getScratchValue(mcid, attr) {
        const g = this.context.g;
        return g;
    }

    /**
     * perfomres animations on said graph using an external
     * plugin according to the value of progress when this 
     * is called.
     */
    onProgress(progress, millisecond) {
        this.SigmaAnimation.changeFrame(progress);
    };
}

  
module.exports = SigmaAnimPlugin;