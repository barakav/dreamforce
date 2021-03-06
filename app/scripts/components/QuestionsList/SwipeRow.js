;(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("react"));
  } else if (typeof define === "function" && define.amd) {
    define(["react"], factory);
  } else {
    root.SwipeToRevealOptions = factory(root.React);
  }
})(this, function (React) {

  function translateStyle(x, measure, y) {
    var _y = y || "0";
    return {
      transform: "translate3d(" + x + measure + ", " + _y + ", 0)",
      WebkitTransform: "translate3d(" + x + measure + ", " + _y + ", 0)"
    };
  }

  var Rating = require('react-rating');

  var Swipeable = React.createClass({ displayName: "Swipeable",
    propTypes: {
      onSwiped: React.PropTypes.func,
      onSwipingUp: React.PropTypes.func,
      onSwipingRight: React.PropTypes.func,
      onSwipingDown: React.PropTypes.func,
      onSwipingLeft: React.PropTypes.func,
      onSwipedUp: React.PropTypes.func,
      onSwipedRight: React.PropTypes.func,
      onSwipedDown: React.PropTypes.func,
      onSwipedLeft: React.PropTypes.func,
      flickThreshold: React.PropTypes.number,
      delta: React.PropTypes.number
    },

    getInitialState: function getInitialState() {
      return {
        x: null,
        y: null,
        swiping: false,
        start: 0
      };
    },

    getDefaultProps: function getDefaultProps() {
      return {
        flickThreshold: 0.6,
        delta: 10
      };
    },

    calculatePos: function calculatePos(e) {
      var x = e.changedTouches[0].clientX;
      var y = e.changedTouches[0].clientY;

      var xd = this.state.x - x;
      var yd = this.state.y - y;

      var axd = Math.abs(xd);
      var ayd = Math.abs(yd);

      return {
        deltaX: xd,
        deltaY: yd,
        absX: axd,
        absY: ayd
      };
    },

    touchStart: function touchStart(e) {
      if (e.touches.length > 1) {
        return;
      }
      this.setState({
        start: Date.now(),
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        swiping: false
      });
    },

    touchMove: function touchMove(e) {
      if (!this.state.x || !this.state.y || e.touches.length > 1) {
        return;
      }

      var cancelPageSwipe = false;
      var pos = this.calculatePos(e);

      if (pos.absX < this.props.delta && pos.absY < this.props.delta) {
        return;
      }

      if (pos.absX > pos.absY) {
        if (pos.deltaX > 0) {
          if (this.props.onSwipingLeft) {
            this.props.onSwipingLeft(e, pos.absX);
            cancelPageSwipe = true;
          }
        } else {
          if (this.props.onSwipingRight) {
            this.props.onSwipingRight(e, pos.absX);
            cancelPageSwipe = true;
          }
        }
      } else {
        if (pos.deltaY > 0) {
          if (this.props.onSwipingUp) {
            this.props.onSwipingUp(e, pos.absY);
            cancelPageSwipe = true;
          }
        } else {
          if (this.props.onSwipingDown) {
            this.props.onSwipingDown(e, pos.absY);
            cancelPageSwipe = true;
          }
        }
      }

      this.setState({ swiping: true });

      if (cancelPageSwipe) {
        e.preventDefault();
      }
    },

    touchEnd: function touchEnd(ev) {
      if (this.state.swiping) {
        var pos = this.calculatePos(ev);

        var time = Date.now() - this.state.start;
        var velocity = Math.sqrt(pos.absX * pos.absX + pos.absY * pos.absY) / time;
        var isFlick = velocity > this.props.flickThreshold;

        this.props.onSwiped && this.props.onSwiped(ev, pos.deltaX, pos.deltaY, isFlick);

        if (pos.absX > pos.absY) {
          if (pos.deltaX > 0) {
            this.props.onSwipedLeft && this.props.onSwipedLeft(ev, pos.deltaX);
          } else {
            this.props.onSwipedRight && this.props.onSwipedRight(ev, pos.deltaX);
          }
        } else {
          if (pos.deltaY > 0) {
            this.props.onSwipedUp && this.props.onSwipedUp(ev, pos.deltaY);
          } else {
            this.props.onSwipedDown && this.props.onSwipedDown(ev, pos.deltaY);
          }
        }
      }

      this.setState(this.getInitialState());
    },

    render: function render() {
      return React.createElement("div", React.__spread({}, this.props, { onTouchStart: this.touchStart,
        onTouchMove: this.touchMove,
        onTouchEnd: this.touchEnd }), this.props.children);
    }
  });

  var SwipeToRevealOptions = React.createClass({
    displayName: "SwipeToRevealOptions",

    propTypes: {
      rightOptions: React.PropTypes.array,
      leftOptions: React.PropTypes.array,
      className: React.PropTypes.string,
      actionThreshold: React.PropTypes.number,
      visibilityThreshold: React.PropTypes.number,
      transitionBackTimeout: React.PropTypes.number,
      callActionWhenSwipingFarLeft: React.PropTypes.bool,
      callActionWhenSwipingFarRight: React.PropTypes.bool,
      closeOthers: React.PropTypes.func,
      onRightClick: React.PropTypes.func,
      onLeftClick: React.PropTypes.func,
      onReveal: React.PropTypes.func,
      maxItemWidth: React.PropTypes.number,
      parentWidth: React.PropTypes.number,
      contentBgColor: React.PropTypes.string,
      isLeftActive: React.PropTypes.bool,
      isRightActive: React.PropTypes.bool,
      onRate: React.PropTypes.func,
      onDismiss: React.PropTypes.func,
      questionObj: React.PropTypes.object,
    },

    getInitialState: function getInitialState() {
      return {
        delta: 0,
        showRightButtons: false,
        showLeftButtons: false,
        swipingLeft: false,
        swipingRight: false,
        transitionBack: false,
        action: null,
        callActionWhenSwipingFarRight: false,
        callActionWhenSwipingFarLeft: false
      };
    },

    getDefaultProps: function getDefaultProps() {
      return {
        rightOptions: [],
        leftOptions: [],
        className: "",
        actionThreshold: 300,
        visibilityThreshold: 50,
        transitionBackTimeout: 400,
        onRightClick: function onRightClick() {},
        onLeftClick: function onLeftClick() {},
        onReveal: function onReveal() {},
        closeOthers: function closeOthers() {},
        maxItemWidth: 120,
        parentWidth: window.outerWidth || screen.width
      };
    },

    onRate: function(rate) {
        if (rate == undefined) {
            return;
        }

        this.props.onRate(rate, this.props.questionObj);
        this.transitionBack();
    },

    onDismiss: function(question) {
        this.props.onDismiss(question);
        this.transitionBack();
    },

    render: function render() {
        var q = this.props.questionObj;

        var classes = this.props.className + " stro-container";

        if (this.state.transitionBack) {
            classes += " transition-back";
        }

        if (this.state.showRightButtons) {
            classes += " show-right-buttons";
        }

        if (this.state.showLeftButtons) {
            classes += " show-left-buttons";
        }

        return React.createElement("div", {
                className: classes,
                style: this.getContainerStyle()
            },
            React.createElement("div", {
                className: "stro-left"
            },
            this.props.leftOptions.map(
                (function (option, index) {
                    return React.createElement("div", {
                        className: "stro-button stro-left-button " + option["class"],
                        style: this.getStyle("left", index),
                    },
                    <Rating
                      full={"fa fa-star"}
                      empty={"fa fa-star-o"}
                      start={0}
                      stop={5}
                      onRate={this.onRate}/>
                )
            }).bind(this))),
            React.createElement(Swipeable, {
                    className: "stro-content",
                    onSwipingLeft: this.swipingLeft,
                    onClick: this.handleContentClick,
                    onSwipingRight: this.swipingRight,
                    delta: 15,
                    onSwiped: this.swiped,
                    style: {backgroundColor: this.props.contentBgColor}
                },
                this.props.children),
            React.createElement("div", {
                className: "stro-right"
            },
            this.props.rightOptions.map(
                (function (option, index) {
                    return React.createElement("div", {
                        className: "stro-button stro-right-button text-center" + option["class"],
                        onClick: this.onDismiss.bind(this, q),
                        style: this.getStyle("right", index)
                    },React.createElement("span", { style: this.getSpanStyle("right", index), dangerouslySetInnerHTML: { __html: "Dismiss" } }));

            }).bind(this))));
    },

    swipingLeft: function swipingLeft(event, delta) {
        if (this.swipingHandleStylesAndDelta(delta, "left")) {
            return;
        }

        var action = null;
        if (delta > this.props.visibilityThreshold) {
            action = "rightVisible";
        }

        if (!this.props.isLeftActive) {
            return;
        }

        if (this.props.callActionWhenSwipingFarLeft && delta > this.props.actionThreshold) {
            action = "rightAction";
        }

        this.setState({
            delta: -delta,
            action: action,
            swipingLeft: true
        });
    },

    swipingRight: function swipingRight(event, delta) {
        if (this.swipingHandleStylesAndDelta(delta, "right")) {
            return;
        }

        var action = null;
        if (delta > this.props.visibilityThreshold) {
            action = "leftVisible";
        }

        if (!this.props.isRightActive) {
            return;
        }

        if (this.props.callActionWhenSwipingFarRight && delta > this.props.actionThreshold) {
            action = "leftAction";
        }

        this.setState({
            delta: delta,
            action: action,
            swipingRight: true
        });
    },

    swipingHandleStylesAndDelta: function swipingHandleStylesAndDelta(delta, direction) {
        if (this.shouldAbort(direction)) {
            return true;
        }

        this.shouldTransitionBack(direction);
        this.shouldCloseOthers(direction);

        return false;
    },

    shouldAbort: function shouldAbort(direction) {
        if (this.state.transitionBack) {
            return true;
        }
        if (direction === "right") {
            return !this.props.leftOptions.length && !this.state.showRightButtons || this.state.showLeftButtons && !this.props.callActionWhenSwipingFarRight;
        }
        else {
            return !this.props.rightOptions.length && !this.state.showLeftButtons || this.state.showRightButtons && !this.props.callActionWhenSwipingFarLeft;
        }
    },

    shouldTransitionBack: function shouldTransitionBack(direction) {
        if (direction === "right" && this.state.showRightButtons || this.state.showLeftButtons) {
            this.transitionBack();
        }
    },

    shouldCloseOthers: function shouldCloseOthers(direction) {
        if (this.props.closeOthers) {
            if (direction === "right" && !this.state.swipingRight || !this.state.swipingLeft) {
                this.props.closeOthers();
            }
        }
    },

    swiped: function swiped() {
      switch (this.state.action) {
        case "rightVisible":
          this.props.onReveal("right");
          this.setState({ showRightButtons: true });
          break;
        case "leftVisible":
          this.props.onReveal("left");
          this.setState({ showLeftButtons: true });
          break;
        case "leftAction":
          this.leftClick(this.props.leftOptions[0]);
          break;
        case "rightAction":
          this.rightClick(this.props.rightOptions[this.props.rightOptions.length - 1]);
          break;
      }
      this.setState({
        delta: 0,
        action: null,
        swipingLeft: false,
        swipingRight: false,
        secondarySwipe: false,
        transitionBack: true
      });
      setTimeout((function () {
        this.setState({ transitionBack: false });
      }).bind(this), this.props.transitionBackTimeout);
    },

    rightClick: function rightClick(option) {
        this.props.onRightClick(option);
        this.transitionBack();
    },

    leftClick: function leftClick(option) {
        this.props.onLeftClick(option);
        this.transitionBack();
    },

    close: function close() {
        this.transitionBack();
    },

    transitionBack: function transitionBack() {
        this.setState({
            showLeftButtons: false,
            showRightButtons: false,
            transitionBack: true
        });
        setTimeout((function () {
            this.setState({ transitionBack: false });
        }).bind(this), this.props.transitionBackTimeout);
    },

    getContainerStyle: function getContainerStyle() {
      var itemWidth;
      if (this.state.delta === 0 && this.state.showRightButtons) {
        itemWidth = this.getItemWidth("right");
        return translateStyle(-this.props.rightOptions.length * itemWidth, "px");
      } else if (this.state.delta === 0 && this.state.showLeftButtons) {
        itemWidth = this.getItemWidth("left");
        return translateStyle(this.props.leftOptions.length * itemWidth, "px");
      }
      return translateStyle(this.state.delta, "px");
    },

    getItemWidth: function getItemWidth(side) {
      var nbOptions = side === "left" ? this.props.leftOptions.length : this.props.rightOptions.length;
      return Math.min(this.props.parentWidth / (nbOptions + 1), this.props.maxItemWidth);
    },

    getStyle: function getStyle(side, index) {
      var factor = side === "left" ? -1 : 1;
      var nbOptions = side === "left" ? this.props.leftOptions.length : this.props.rightOptions.length;
      var width = this.getItemWidth(side);
      var transition;
      var style;

      if (this.state.transitionBack || (side === "left" && this.state.showLeftButtons || this.state.showRightButtons)) {
        style = translateStyle(factor * index * width, "px");
        return style;
      }

      var modifier = index * 1 / nbOptions;
      var offset = -factor * modifier * this.state.delta;
      if (Math.abs(this.state.delta) > this.props.actionThreshold && (side === "left" && this.props.callActionWhenSwipingFarRight || this.props.callActionWhenSwipingFarLeft) && index === nbOptions - 1) {
        transition = "transform 0.15s ease-out";
        offset = 0;
      } else if (nbOptions * width < Math.abs(this.state.delta)) {
        offset += factor * (Math.abs(this.state.delta) - nbOptions * width) * 0.85;
      }
      style = translateStyle(offset, "px");
      if (transition) {
        style.transition = transition;
      }
      return style;
    },

    getSpanStyle: function getSpanStyle(side, index) {
      var width = this.getItemWidth(side);
      var factor = side === "left" ? 1 : -1;
      var nbOptions = side === "left" ? this.props.leftOptions.length : this.props.rightOptions.length;
      var padding;
      var style;

      if (this.state.transitionBack || (side === "left" && this.state.showLeftButtons || this.state.showRightButtons)) {
        style = translateStyle(0, "px", "-50%");
        style.width = width;
        return style;
      }

      if (Math.abs(this.state.delta) > this.props.actionThreshold && (side === "left" && this.props.callActionWhenSwipingFarRight || this.props.callActionWhenSwipingFarLeft) && index === nbOptions - 1) {
        padding = 0;
      } else if (nbOptions * width < Math.abs(this.state.delta)) {
        padding += factor * (Math.abs(this.state.delta) - nbOptions * width) * 0.425;
      }
      style = translateStyle(padding, "px", "-50%");
      style.width = width;
      return style;
    },

    handleContentClick: function handleContentClick() {
      this.props.closeOthers();
      this.transitionBack();
    }
  });

  return SwipeToRevealOptions;
});
