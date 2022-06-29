import loop from './loop2.svg'

class GraphDefintions {

  static get STANDARD() {
    return {
      BASEFILL: '#B8B8B8',
      TEXT: '#212121',
    }
  }

  static get SELECTED() {
    return {
      BASEFILL: '#F3819B',
      TEXT: '#212121',
    }
  }

  static get PORT_COLORS() {
    return {
      INPUT: {
        STROKE: '#FFFFFF',
        FILL: '#F6AE2D',
      },
      OUTPUT: {
        STROKE: '#FFFFFF',
        FILL: '#B8B8B8',
      }
    }
  }

  static get EDGE() {
    return { COLOR: '#000000' }
  }

  static get TRANSITION_COLORS() {
    return {
      CONNECTED: {
        FILL: '#B8B8B8',
        STROKE: '#FFFFFF',
      },
      DISCONNECTED: {
        FILL: '#86BBD8',
        STROKE: '#FFFFFF',
      },
    }
  }

  static get LOOPGATEWAY_COLORS() {
    return {
      IN: {
        CONNECTED: {
          FILL: '#B8B8B8',
          STROKE: '#FFFFFF',
        },
        DISCONNECTED: {
          FILL: '#F6AE2D',
          STROKE: '#FFFFFF',
        },
      },
      LOOP: {
        CONNECTED: {
          FILL: '#B8B8B8',
          STROKE: '#FFFFFF',
        },
        DISCONNECTED: {
          FILL: '#86BBD8',
          STROKE: '#FFFFFF',
        },
      },
      OUT: {
        CONNECTED: {
          FILL: '#B8B8B8',
          STROKE: '#FFFFFF',
        },
        DISCONNECTED: {
          FILL: '#86BBD8',
          STROKE: '#FFFFFF',
        },
      },
    }

  }

  static get StartEndDefintion() {
    return {
      inherit: 'polygon',
      width: 50,
      height: 50,
      attrs: {
        body: {
          fill: GraphDefintions.STANDARD.BASEFILL,
          refPoints: '0,10 10,0 20,10 10,20',
        },
        text: { fill: GraphDefintions.STANDARD.TEXT },
      },
      ports: {
        items: [
        ],
        groups: {
          in: {
            position: 'left',
            attrs: {
              portBody: {
                magnet: 'passive',
                r: 5,
                fill: '#fff',
                strokeWidth: 1.5,
              },
            },
          },
          out: {
            position: 'right',
            attrs: {
              portBody: {
                magnet: true,
                r: 5,
                fill: '#fff',
                strokeWidth: 1.5,
              },
            },
          },
        },

      },
      portMarkup: [
        {
          tagName: 'circle',
          selector: 'portBody',
        },
      ],
      markup: [
        {
          tagName: 'polygon',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'title',
        },
      ],
    }
  }

  static get LoopGatewayDefintion() {
    return {
      inherit: 'rect',
      width: 50,
      height: 50,
      attrs: {
        body: {
          // stroke: '#C94343',
          strokeWidth: 0,
          rx: 5,
          ry: 5,
          fill: GraphDefintions.STANDARD.BASEFILL,
        },
        image: {
          xlinkHref: loop,
          width: 40,
          height: 40,
          refX: 5,
          refY: 5,
          fill: GraphDefintions.STANDARD.TEXT,

        },
        text: { fill: GraphDefintions.STANDARD.TEXT },
      },

      portMarkup: [
        {
          tagName: 'circle',
          selector: 'portBody',
        },
      ],
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'title',
        },
        {
          tagName: 'image',
          selector: 'image',
        },
      ],
    }
  }

  static get LoopGatewayPorts() {
    return {
      ports: {
        items: [
          { group: 'in' },
          { group: 'out' },
          { group: 'loop' },
        ],
        groups: {
          in: {
            position: 'left',
            attrs: {
              portBody: {
                magnet: 'passive',
                r: 6,
                strokeWidth: 1.5,
              },
            },
          },
          out: {
            position: 'right',
            attrs: {
              portBody: {
                magnet: true,
                r: 6,
                strokeWidth: 1.5,
              },
            },
          },
          loop: {
            position: 'top',
            attrs: {
              portBody: {
                magnet: 'true',
                r: 6,
                strokeWidth: 1.5,
              },
            },
          },

        },

      },
    }
  }

  static get TransitionPortDefintion() {
    return {
      selector: 'image',
      tagName: 'image',
      inherit: 'image',
      group: 'out',
      attrs: {
        img: {
          magnet: true,
          refX: -9,
          refY: -9,
          width: 18,
          height: 18,
          zIndex: 2,
        },
        circle: {
          magnet: true,
          r: 10,
          stroke: GraphDefintions.PORT_COLORS.OUTPUT.STROKE,
          fill: '#fff',
          strokeWidth: 1.5,
          zIndex: 3,
        },
      },
      markup: [{
        tagName: 'circle',
        selector: 'cirlce',
      }, {
        tagName: 'image',
        selector: 'img',
      }],
    }
  }

  static get BaseDefintion () {
    return {
      shape: 'rect',
      width: 125,
      height: 50,
      attrs: {
        body: {
          // stroke: '#FFFFF',
          strokeWidth: 0,
          rx: 8,
          ry: 8,
          fill: GraphDefintions.STANDARD.BASEFILL,
        },
        text: { fill: GraphDefintions.STANDARD.TEXT },
        title: {
          textWrap: {
            width: -10,
            height: '80%', // 高度为参照元素高度的一半
            ellipsis: true, // 文本超出显示范围时，自动添加省略号
            breakWord: true, // 是否截断单词

          },
        },

      },
      ports: {
        items: [
        ],
        groups: {
          in: {
            position: 'left',
            attrs: {
              portBody: {
                magnet: 'passive',
                r: 5,
                stroke: GraphDefintions.PORT_COLORS.INPUT.STROKE,
                fill: '#fff',
                strokeWidth: 1.5,
              },
            },
          },
          out: {
            position: 'right',
            attrs: {
              portBody: {
                magnet: true,
                r: 7,
                fill: '#fff',
                stroke: '#FF6347',
                strokeWidth: 1,
              },
            },
          },
        },

      },
      portMarkup: [
        {
          tagName: 'circle',
          selector: 'portBody',
        },
      ],
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'title',
        },
      ],
    }
  }

}

export default GraphDefintions
