const MotorCortex = require("@kissmybutton/motorcortex");

class MyAttrChannel extends MotorCortex.AttributeChannel {
  constructor(props) {
    super(props);
    this.s = {};
    this.compoAttributes = {
      finalG:["nodes","edges"]
    }
  }
}

module.exports = MyAttrChannel;