const MC = require("@kissmybutton/motorcortex/");
window.sigma = require("sigma");
const SigmaAnimation = require("../lib/SigmaAnimationPlugin.js")

class SigmaAnimPlugin extends MC.TimedIncident {

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
        console.log(progress, millisecond)
    };
}

  
module.exports = SigmaAnimPlugin;