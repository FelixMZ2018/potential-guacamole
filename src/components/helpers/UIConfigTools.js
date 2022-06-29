/**
 * Class to manipulate and generate a ui config
 *
 * @class GraphToWorkflowUIConfiAdapter
 */
class UIConfigTools {

  static get exampleStructure() {
    return {
      phase_1: {
        position: {
          x: 100,
          y: 200,
        },
        label: 'PotatoPhase',
      },
    }
  }

  static add (id, data, uiConfig) {
    const newConfig = { ...uiConfig }
    newConfig[id] = data
    return newConfig
  }

  static updatePosition(id, newData, uiConfig) {
    const mergedData = { position: newData.position }
    if (uiConfig[id].label) {
      mergedData.label = uiConfig[id].label
    }
    const newConfig = { ...uiConfig }
    newConfig[id] = mergedData

    return newConfig
  }

  static updateLabel(id, newLabel, uiConfig) {
    const mergedData = { label: newLabel }
    if (uiConfig[id].position) {
      mergedData.position = uiConfig[id].position
    }
    const newConfig = { ...uiConfig }
    newConfig[id] = mergedData

    return newConfig
  }

  static getLabelOrId(id, uiConfig) {
    if (uiConfig[id] && uiConfig[id].label) {
      return uiConfig[id].label
    }
    return id
  }

  static removById(id, uiConfig) {
    const newConfig = { ...uiConfig }
    delete newConfig[id]

    return newConfig
  }

  static generateFromJSON(json, initialConfig) {
    const uiConfig = {}
    json.nodes.forEach(node => {
      uiConfig[node.id] = {
        position: {
          x: node.x,
          y: node.y,
        },
        label: initialConfig[node.id].label || node.id
      }
    })
    return uiConfig

  }

}

export default UIConfigTools
